import paho.mqtt.client as mqtt
import subprocess
import ssl
import os
import random
import string

# --- (設定は変更なし) ---
CERT_DIR = os.path.join(os.path.dirname(__file__), 'crts')
CA_CERT = os.path.join(CERT_DIR, "AmazonRootCA1.pem")
CERT_FILE = os.path.join(CERT_DIR, "f3b7624d190eb2efc1281c8498e176d5d4674eed0eb1c59e68c717e321a29b30-certificate.pem.crt")
KEY_FILE = os.path.join(CERT_DIR, "f3b7624d190eb2efc1281c8498e176d5d4674eed0eb1c59e68c717e321a29b30-private.pem.key")
IOT_ENDPOINT = "a12khnx6zbz7zx-ats.iot.us-east-1.amazonaws.com"
# MQTT_TOPIC = "gps/start"
# --- 設定終わり ---
TOPIC_TO_SUBSCRIBE = {
    "gps/start",
    "gps/stop"
}
# (on_connect, on_message, on_log 関数は変更なし)
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("MQTTブローカーに接続成功")
        for topic in TOPIC_TO_SUBSCRIBE:
            client.subscribe(topic)
            print(f"トピック '{topic}' の購読を開始しました。")
    else:
        print(f"接続失敗、リターンコード= {rc}")

def on_message(client, userdata, msg):
    global process
    print(f"メッセージ受信: トピック='{msg.topic}', ペイロード='{msg.payload.decode()}'")
    if msg.topic == "gps/start":
        try:
            print("axis.py をバックグラウンドで起動します...")
            process = subprocess.Popen(["python3", "/home/ecoxile/Documents/pro/aws-gps-react/src/axis.py"])
        except FileNotFoundError:
            print("エラー: 'python3' コマンドが見つかりません。")
        except Exception as e:
            print(f"axis.py の起動中にエラーが発生しました: {e}")
    elif msg.topic == "gps/stop":
        try:
            print("axis.py をバックグラウンドで停止します...")
            process.terminate()
        except FileNotFoundError:
            print("エラー: 'python3' コマンドが見つかりません。")
        except Exception as e:
            print(f"axis.py の起動中にエラーが発生しました: {e}")


def on_log(client, userdata, level, buf):
    print(f"log: {buf}")


# ★★★★★ ここが修正点 ★★★★★
# ユニークなクライアントIDを生成
client_id = "gps-listener-" + "".join(random.choices(string.ascii_letters + string.digits, k=8))
print(f"使用する Client ID: {client_id}")

# Client IDを指定してクライアントを初期化
client = mqtt.Client(client_id=client_id)
# ★★★★★ 修正ここまで ★★★★★


client.on_log = on_log
client.tls_set(ca_certs=CA_CERT,
               certfile=CERT_FILE,
               keyfile=KEY_FILE,
               tls_version=ssl.PROTOCOL_TLSv1_2)

client.on_connect = on_connect
client.on_message = on_message

print(f"{IOT_ENDPOINT} に接続します...")
client.connect(IOT_ENDPOINT, 8883, 60)

try:
    client.loop_forever()
except Exception as e:
    print(f"ループ中にエラーが発生しました: {e}")
    client.disconnect()