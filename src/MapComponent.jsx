import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ▼▼▼ ステップ1: カスタムアイコンの準備 ▼▼▼

// デフォルトの青いアイコン
const blueIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 赤色のマーカーアイコン（画像が必要です）
// ここでは例として、オンラインのフリー素材画像を使っています。
// ご自身で 'marker-red.png' のような画像を用意してプロジェクトに入れるのが理想です。
const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 黄色のマーカーアイコン
const yellowIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// ▼▼▼ ステップ2: アイコン選択関数の作成 ▼▼▼
const getIconByStatus = (status) => {
  switch (status) {
    case 'red':
      return redIcon;
    case 'yellow':
      return yellowIcon;
    case 'blue':
      return blueIcon;
    default:
      // statusがない場合や想定外の値の場合はデフォルトのアイコンを返す
      return blueIcon;
  }
};


const MapComponent = () => {
  const [data, setData] = useState([]);
  const [center, setCenter] = useState([34.84, 136.58]); // デフォルトの中心地
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // DynamoDBからデータを取得するAPIエンドポイント
    fetch('https://o1laqwoele.execute-api.us-east-1.amazonaws.com/dev')
      .then((res) => {
        if (!res.ok) {
            throw new Error(`データ取得エラー: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        // ... (以前のデータ整形ロジックは変更なし) ...
        let dataArray = [];
        if (typeof json.body === 'string') {
          try {
            dataArray = JSON.parse(json.body);
          } catch (e) {
            setError('データ形式が正しくありません');
            setLoading(false);
            return;
          }
        } else if (Array.isArray(json)) {
          dataArray = json;
        } else {
          dataArray = [json];
        }

        const validData = dataArray
          .filter((item) => item.latitude && item.longitude)
          .map((item) => ({
            ...item,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }));

        if (validData.length === 0) {
          setError('位置データがありません');
          setLoading(false);
          return;
        }
        setData(validData);
        setCenter([validData[0].latitude, validData[0].longitude]);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Fetch error:', e);
        setError(`データ取得中にエラーが発生しました: ${e.message}`);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((item) => (
        // ▼▼▼ ステップ3: マーカーコンポーネントの修正 ▼▼▼
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          // iconプロパティに、statusに応じたアイコンを渡す
          icon={getIconByStatus(item.status)}
        >
          <Popup>
            ID: {item.id}
            <br />
            Time: {item.time}
            <br />
            {/* statusも表示すると分かりやすい */}
            Status: {item.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;