import React from 'react';
import MapComponent from './MapComponent';
import Startpage from './Startpage'
import 'leaflet/dist/leaflet.css';
import { BrowserRouter, Routes,Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = '/' element={<Startpage/>} />
      <Route path = '/map' element={<MapComponent/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
