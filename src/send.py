import requests
import json

url = "https://e4jbg4i3ve.execute-api.us-east-1.amazonaws.com/test"
PARAMS = {
    'key1' :'value1',
    'key2' :'value2'
}

# JSONファイルを読み込む
with open('axis_data.json', 'r') as f:
    json_data = json.load(f)

headers = {
    "Content-Type": "application/json"
}

response = requests.get(url, params=PARAMS,headers=headers, json=json_data)

print(response.status_code)
print(response.text)
