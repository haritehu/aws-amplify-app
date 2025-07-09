// GpsStartPage.jsx

import React,{useState} from 'react';
import Select from 'react-select';
import TriggerGpsButton from './TriggerGpsButton';

const stateOptions = [
    { value: 'red', label: '駆除完了' },
    { value: 'blue', label: '産卵床発見' },
    { value: 'yellow', label: '再発見' }
];

const GpsStartPage = () => {
    // 関数名や変数名も一般的なキャメルケースに修正
    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div>
            <h1><center>ステータスを選択してください</center></h1>
            <Select
                options={stateOptions}
                onChange={handleChange}
                value={selectedOption}
            />
            {selectedOption && (
                <p>value: {selectedOption.value}</p>
            )}

            {/* ▼▼▼ 修正点 ▼▼▼ */}
            {/* props名を selectedOption に統一 */}
            <TriggerGpsButton selectedOption={selectedOption} />
        </div>
    );
};

export default GpsStartPage;