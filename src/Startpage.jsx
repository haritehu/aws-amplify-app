// HomePage.jsx
import { useNavigate } from 'react-router-dom';
import './Startpage.css';
import TriggerGpsButton from './TriggerGpsButton';

function Startpage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1>ようこそ！</h1>
      <button
        class="styled-button"
        onClick={() => navigate('/map')}
      >
        マップへ進む
      </button>
      <TriggerGpsButton/>
    </div>
  );
}

export default Startpage;
