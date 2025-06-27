import React from 'react';

function TriggerGpsButton({selectedoption}) {
  const handleClick = async () => {
    try {
      if(!selectedoption){
        alert("選択してください！")
        return
      }
      const res = await fetch("https://xhfskisa04.execute-api.us-east-1.amazonaws.com/start", {
        method: "POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
            value : selectedoption.value,
            lavel : selectedoption.lavel
        })
      });

      if (!res.ok) {
        throw new Error(`サーバーエラー: ${res.status}`);
      }
      
      const result = await res.json();
      
      // bodyは文字列なので、JSON.parse()でオブジェクトに変換する
      const bodyData = JSON.parse(result.body);

      // 変換したオブジェクトからmessageプロパティを取得
      alert(bodyData.message);

    } catch (error) {
      console.error("GPS測定開始リクエストに失敗しました:", error);
      alert(`エラーが発生しました: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="styled-button" 
    >
      GPS測定を開始する
    </button>
  );
}

export default TriggerGpsButton;