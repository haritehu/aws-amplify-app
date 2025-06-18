// src/components/TriggerGpsButton.jsx
import React from 'react';


function TriggerGpsButton() {
  const handleClick = async () => {
    const res = await fetch("https://xhfskisa04.execute-api.us-east-1.amazonaws.com/start", {
      method: "POST",
    });

    const result = await res.json();
    alert(result.message);
  };

  return (
    <button
      onClick={handleClick}
      class="styled-button"
    >
      GPS測定を開始する
    </button>
  );
}

export default TriggerGpsButton;
