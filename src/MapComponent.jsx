import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';

function MapView() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetch('https://o1laqwoele.execute-api.us-east-1.amazonaws.com/dev')
      .then(res => res.json())
      .then(data => setPositions(data));
  }, []);

  return (
    <MapContainer center={[35.6895, 139.6917]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {positions.map((pos, idx) => (
        <Marker key={idx} position={[pos.lat, pos.lng]}>
          <Popup>位置 {idx + 1}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;

