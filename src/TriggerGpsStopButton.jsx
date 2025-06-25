import React from "react";


function TriggerGpsStopButton(){
    const handleClick = async() => {
        try{
            const res = await fetch("https://ommd43qmp4.execute-api.us-east-1.amazonaws.com/stop",{
                method : "POST"
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
    return(
        <button
        onClick = {handleClick}
        className="styled-button"
        >
        測定を停止します
        </button>   
    )
};
export default TriggerGpsStopButton