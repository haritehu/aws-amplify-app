# ベースイメージとしてPython 3.11 を使用
FROM python:3.11-slim

# 作業ディレクトリを /app に設定
WORKDIR /app

# まず requirements.txt をコピーして、ライブラリをインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコピー
COPY ./src .

# デフォルトのコマンド (docker-compose側で上書きするので、これは通常使われません)
CMD ["python", "mqtt_listener.py"]
