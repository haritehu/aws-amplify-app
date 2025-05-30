import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leafletのデフォルトアイコン設定（画像パス確実に指定）
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = () => {
  const [data, setData] = useState([]);
  const [center, setCenter] = useState([34.84, 136.58]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://o1laqwoele.execute-api.us-east-1.amazonaws.com/dev')
      .then((res) => res.json())
      .then((json) => {
        console.log('API raw response:', json);

        let dataArray = [];

        if (typeof json.body === 'string') {
          try {
            dataArray = JSON.parse(json.body);
          } catch (e) {
            console.error('bodyのJSONパースエラー:', e);
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
        setError('データ取得中にエラーが発生しました');
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
        <Marker key={item.id} position={[item.latitude, item.longitude]}>
          <Popup>
            ID: {item.id}
            <br />
            Time: {item.time}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
