import React, { useState } from 'react';
import './Form.css';

function Form() {
    const [dropdownValue, setDropdownValue] = useState("option1");
    const [rangeValue1, setRangeValue] = useState(50);

    const min = 1;
    const max = 100;

    const calculateThumbPosition = (value) => {
        return ((value - min) / (max - min)) * 100;
    }

    const thumbPosition = calculateThumbPosition(rangeValue1);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Dropdown Value:", dropdownValue);
        console.log("Range Value:", rangeValue1);
    };

    return (
        <form onSubmit={handleSubmit}>

            <div className="top-bar">My Top Bar</div>

            <select value={dropdownValue} onChange={(e) => setDropdownValue(e.target.value)}>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>

            <div className="range-value-display"
                style={{ left: `calc(${thumbPosition}% - 12px)` }}>  {/* 12px to center the value above the thumb */}
                {rangeValue1}
            </div>


            <input
                type="range"
                min="{min}"
                max="{max}"
                value={rangeValue1}
                onChange={(e) => setRangeValue(e.target.value)}
            />

            <button type="submit">Submit</button>
        </form>
    );
}

export default Form;
