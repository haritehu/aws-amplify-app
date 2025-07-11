import serial
import pynmea2
import json
from datetime import datetime
import uuid
from time import sleep
import requests
import sys
# 初期設定
ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)

url = "https://e4jbg4i3ve.execute-api.us-east-1.amazonaws.com/test"
PARAMS = {
    'key1' :'value1',
    'key2' :'value2'
}


def send_gps():
    with open('axis_data.json', 'r') as f:
        json_data = json.load(f)

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.get(url, params=PARAMS,headers=headers, json=json_data)

    print(response.status_code)
    print(response.text)
#GPS情報取得
def axis_load():
    line = ser.readline().decode('utf-8', errors='ignore').strip()
    msg = pynmea2.parse(line)
    latitude = getattr(msg, 'latitude', None)
    longitude = getattr(msg, 'longitude', None)
    if latitude is None or longitude is None:
        return axis_load()
    return msg


def json_load(msg,status):
    id = str(uuid.uuid4())
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # latitude/longitude を安全に取得
    latitude = getattr(msg, 'latitude', None)
    longitude = getattr(msg, 'longitude', None)
    if latitude == 0 or longitude == 0:
         print(latitude,longitude)
         print("Gpsがまだ取得されていません")
         return 0
    new_axis_data = {
        "id": id,
        "time": now,
        "latitude": latitude,
        "longitude": longitude,
        "status":status,
    }

    with open("axis_data.json", "w", encoding="utf-8") as f:
        json.dump(new_axis_data, f, ensure_ascii=False, indent=2)

    print("✅ 書き込み成功:", new_axis_data)


def timer(time):
        for i in range(0,time):
              sleep(1)
        

def main():
        try:
            # sys.argv[0] はスクリプト名なので、最初の引数は[1]になる
            status = sys.argv[1]
        except IndexError:
            # 引数が渡されなかった場合のデフォルト値（エラー処理）
            print("エラー: ステータスが指定されていません。'default'を使用します。")
            status = "default"

        print(f"受け取ったステータス: {status}")
     
        msg = axis_load()
        flag = json_load(msg,status)
        if flag != 0:
            send_gps()
        return 0

if __name__ == "__main__":
      main()