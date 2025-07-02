import paho.mqtt.client as mqtt
import subprocess
import ssl
import os
import random
import string
import json

# --- 設定 ---
# このスクリプトがあるディレクトリを基準に証明書ファイルへのパスを指定
CERT_DIR = os.path.join(os.path.dirname(__file__), 'crts')
CA_CERT = os.path.join(CERT_DIR, "AmazonRootCA1.pem")
# ご自身の証明書ファイル名、キーファイル名に置き換えてください
CERT_FILE = os.path.join(CERT_DIR, "f3b7624d190eb2efc1281c8498e176d5d4674eed0eb1c59e68c717e321a29b30-certificate.pem.crt")
KEY_FILE = os.path.join(CERT_DIR, "f3b7624d190eb2efc1281c8498e176d5d4674eed0eb1c59e68c717e321a29b30-private.pem.key")
# ご自身のAWS IoTエンドポイントに置き換えてください
IOT_ENDPOINT = "a12khnx6zbz7zx-ats.iot.us-east-1.amazonaws.com"
# 購読するトピック
TOPIC_TO_SUBSCRIBE = {
    "gps/start",
    "gps/stop"
}
# 起動するPythonスクリプトのフルパス
# ご自身の環境に合わせてパスを修正してください
AXIS_SCRIPT_PATH = "/home/ecoxile/Documents/pro/aws-gps-react/src/axis.py"
# --- 設定終わり ---

# axis.pyのプロセスを格納するグローバル変数
process = None

def on_connect(client, userdata, flags, rc):
    """MQTTブローカーに接続したときに呼ばれるコールバック関数"""
    if rc == 0:
        print("MQTTブローカーに接続成功")
        for topic in TOPIC_TO_SUBSCRIBE:
            client.subscribe(topic)
            print(f"トピック '{topic}' の購読を開始しました。")
    else:
        print(f"接続失敗、リターンコード= {rc}")

def on_message(client, userdata, msg):
    """MQTTメッセージを受信したときに呼ばれるコールバック関数"""
    global process
    print(f"メッセージ受信: トピック='{msg.topic}', ペイロード='{msg.payload.decode()}'")

    if msg.topic == "gps/start":
        try:
            # 受信したペイロード(JSON文字列)をPythonの辞書に変換
            data = json.loads(msg.payload.decode())
            
            # 辞書からステータスの値(例: 'red')を取得
            status_value = data.get('value')

            if not status_value:
                print("エラー: 受信したデータにステータスの値(value)が含まれていません。")
                return

            print(f"axis.py をバックグラウンドで起動します... ステータス: {status_value}")
            
            # axis.pyを起動する際、コマンドライン引数としてステータスの値を渡す
            process = subprocess.Popen(["python3", AXIS_SCRIPT_PATH, status_value])

        except json.JSONDecodeError:
            print("エラー: 受信したペイロードが正しいJSON形式ではありません。")
        except FileNotFoundError:
            print(f"エラー: '{AXIS_SCRIPT_PATH}' が見つかりません。パスを確認してください。")
        except Exception as e:
            print(f"axis.py の起動中にエラーが発生しました: {e}")

    elif msg.topic == "gps/stop":
        try:
            print("axis.py を停止しようとしています...")
            # プロセスが存在し、かつ実行中であるかを確認
            if process and process.poll() is None:
                process.terminate()
                print("axis.py を停止しました。")
            else:
                print("axis.pyは既に停止しているか、起動していません。")
        except Exception as e:
            print(f"axis.py の停止中にエラーが発生しました: {e}")

def on_log(client, userdata, level, buf):
    """デバッグ用のログを出力するコールバック関数"""
    print(f"log: {buf}")


# --- メインの処理 ---
if __name__ == "__main__":
    # ユニークなクライアントIDを生成
    client_id = "gps-listener-" + "".join(random.choices(string.ascii_letters + string.digits, k=8))
    print(f"使用する Client ID: {client_id}")

    # Client IDを指定してクライアントを初期化
    client = mqtt.Client(client_id=client_id)
    
    # 各種コールバック関数を登録
    client.on_log = on_log
    client.on_connect = on_connect
    client.on_message = on_message

    # TLS(SSL)の設定
    client.tls_set(ca_certs=CA_CERT,
                   certfile=CERT_FILE,
                   keyfile=KEY_FILE,
                   tls_version=ssl.PROTOCOL_TLSv1_2)

    # AWS IoTエンドポイントに接続
    print(f"{IOT_ENDPOINT} に接続します...")
    client.connect(IOT_ENDPOINT, 8883, 60)

    try:
        # 無限ループでメッセージを待ち受ける
        client.loop_forever()
    except KeyboardInterrupt:
        print("\nCtrl+C が押されました。処理を中断します。")
    except Exception as e:
        print(f"ループ中に予期せぬエラーが発生しました: {e}")
    finally:
        # プログラム終了時に接続を切断
        client.disconnect()
        print("MQTTブローカーから切断しました。")