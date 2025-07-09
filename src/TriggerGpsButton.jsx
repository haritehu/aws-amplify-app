import React from 'react';

function TriggerGpsButton({ selectedOption }) {
  const handleClick = async () => {
    try {
      if (!selectedOption) {
        alert("選択してください！");
        return;
      }

      const res = await fetch("https://xhfskisa04.execute-api.us-east-1.amazonaws.com/start", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value: selectedOption.value,
            label: selectedOption.label,
            message: "接続完了"
        })
      });

      if (!res.ok) {
        throw new Error(`サーバーエラー: ${res.status}`);
      }
      
      // Lambdaから返ってきたJSONをそのまま受け取る
      const result = await res.json();
      console.log('Response from Lambda:', result);

      // ▼▼▼ ここからが重要な修正点 ▼▼▼
      // resultオブジェクトに 'message' が存在するかチェックする
      if (result.message) {
        // 直接 result.message をアラートで表示
        alert(result.message);
      } else {
        // 予期せぬ形式の応答が来た場合
        throw new Error('Lambdaから予期せぬ形式の応答がありました。');
      }
      // ▲▲▲ ここまで ▲▲▲

    } catch (error) {
      console.error("GPS測定開始リクエストに失敗しました:", error);
      alert(error.message);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="styled-button" 
    >
      産卵床のピンを配置する
    </button>
  );
}

export default TriggerGpsButton;