import React,{useState} from 'react';
import Select from 'react-select';
import TriggerGpsButton from './TriggerGpsButton';
// 選択肢のデータ（変更なし）
const stateOptions = [
    { value: 'red', label: '駆除完了' },
    { value: 'blue', label: '産卵床発見' },
    { value: 'yellow', label: '再発見' }
];

const GpsStartPage = () => {
    const [selectedOptions,setselectOptions] = useState(null)
    const handlechange = (option) =>{
        setselectOptions(option)
    }// return文の中で、表示したいコンポーネントを返す
    return (
        <div>
            <h1>ステータスを選択してください</h1>
            <Select 
                options={stateOptions} 
                onChange={handlechange}
                value={selectedOptions}
            />
            {selectedOptions &&(
                <p>value:{selectedOptions.value}</p>
            )
            }
            <TriggerGpsButton selectedoption={selectedOptions}/>
        </div>
    );
};

export default GpsStartPage;