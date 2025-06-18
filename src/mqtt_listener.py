import paho.mqtt.client as mqtt
import subprocess
import ssl

def on_connect(client, userdata, flags, rc):
    print("接続成功 rc=" + str(rc))
    client.subscribe("gps/start")

def on_message(client, userdata, msg):
    print("メッセージ受信:", msg.payload.decode())
    if msg.topic == "gps/start":
        subprocess.Popen(["python3", "axis.py"])

client = mqtt.Client()
client.tls_set(ca_certs="/home/ecoxile/Documents/pro/aws-gps-react/src/crts/AmazonRootCA1.pem",
               certfile="src/crts/f3b7624d190eb2efc1281c8498e176d5d4674eed0eb1c59e68c717e321a29b30-certificate.pem.crt",
               keyfile="/home/ecoxile/Documents/pro/aws-gps-react/src/crts/f3b7624d190eb2efc1281c8498e176d5d4674eed0eb1c59e68c717e321a29b30-private.pem.key",
               tls_version=ssl.PROTOCOL_TLSv1_2)
client.connect("a12khnx6zbz7zx-ats.iot.us-east-1.amazonaws.com", 8883, 60)
client.on_connect = on_connect
client.on_message = on_message
client.loop_forever()
