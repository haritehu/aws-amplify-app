// HomePage.jsx
import { useNavigate } from 'react-router-dom';
import './Startpage.css';
import TriggerGpsButton from './TriggerGpsButton';
import TriggerGpsStopButton from './TriggerGpsStopButton';

function Startpage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1>ブルーギル産卵床マッピング</h1>
      <button
        className="styled-button"
        onClick={() => navigate('/map')}
      >
        マップへ進む
      </button>
      <TriggerGpsButton/>
      <TriggerGpsStopButton/>
      <button 
        className="styled-button"
        onClick={() => navigate('/selectstate')}
      >
        GPsの測定を開始する
      </button>
    </div>
  );
}

export default Startpage;
