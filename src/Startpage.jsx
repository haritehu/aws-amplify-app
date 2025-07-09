// HomePage.jsx
import { useNavigate } from 'react-router-dom';
import './Startpage.css';
//import TriggerGpsButton from './TriggerGpsButton';
//import TriggerGpsStopButton from './TriggerGpsStopButton';

function Startpage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1><center>ブルーギル産卵床マッピング</center></h1>
      <button
        className="styled-button"
        onClick={() => navigate('/map')}
      >
        マップへ進む
      </button>
      <button 
        className="styled-button"
        onClick={() => navigate('/selectstate')}
      >
        産卵床記録
      </button>
    </div>
  );
}

export default Startpage;
