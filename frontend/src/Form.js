import React, { useState } from 'react';
import './Form.css';

function Form() {
    const [dropdownValue_data, setDropdownValueData] = useState("option1");
    const [dropdownValue_algo, setDropdownValueAlgo] = useState("option1");
    const [dropdownValue_batch, setDropdownValueBatch] = useState("option3");
    const [rangeValueEpochs, setRangeValueEpochs] = useState(10);
    const [rangeValueComm, setRangeValueComm] = useState(32);
    const [rangeValueUser, setRangeValueUser] = useState(5);
    const [rangeValueFrac, setRangeValueFrac] = useState(0.3);
    const [rangeValueDeg, setRangeValueDeg] = useState(0.5);


    const calculateThumbPosition = (value, min, max) => {
        return ((value - min) / (max - min)) * 100;
    }

    const thumbPositionEpochs = calculateThumbPosition(rangeValueEpochs, 10, 50);
    const thumbPositionComm = calculateThumbPosition(rangeValueComm, 10, 100);
    const thumbPositionUser = calculateThumbPosition(rangeValueUser, 1, 100);
    const thumbPositionFrac = calculateThumbPosition(rangeValueFrac, 0.01, 1.00);
    const thumbPositionDeg = calculateThumbPosition(rangeValueDeg, 0.00, 1.00);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Dropdown Value:", dropdownValue_data);
        console.log("Dropdown Value:", dropdownValue_algo);
        console.log("Dropdown Value:", dropdownValue_batch);
        console.log("Range Value:", rangeValueEpochs);
        console.log("Range Value:", rangeValueComm);
        console.log("Range Value:", rangeValueUser);
        console.log("Range Value:", rangeValueFrac);
        console.log("Range Value:", rangeValueDeg);
    };

    return (
        <div className="container mt-5">
            <form className="row g-3" onSubmit={handleSubmit}>

                <div className="col-md-12">
                    <label htmlFor="inputState" className="form-label">Dataset</label>
                    <select id="inputState" placeholder="Please Choose..." className="form-select" value={dropdownValue_data} onChange={(e) => setDropdownValueData(e.target.value)}>
                        <option value="" selected disabled>Please Select...</option>
                        <option value="option1">MNIST</option>
                        <option value="option2">CIFAR</option>
                    </select>
                </div>

                <div className="col-md-12">
                    <label htmlFor="inputState" className="form-label">Algorithm</label>
                    <select id="inputState" placeholder="Please Choose..." className="form-select" value={dropdownValue_algo} onChange={(e) => setDropdownValueAlgo(e.target.value)}>
                        <option value="" selected disabled>Please Select...</option>
                        <option value="option1">FedAvg</option>
                        <option value="option2">FedProx</option>
                    </select>
                </div>

                <div className="col-md-12">
                    <label htmlFor="inputState" className="form-label">Batch Size</label>
                    <select id="inputState" placeholder="Please Choose..." className="form-select" value={dropdownValue_batch} onChange={(e) => setDropdownValueBatch(e.target.value)}>
                        <option value="" selected disabled>Please Select...</option>
                        <option value="option1">32</option>
                        <option value="option2">64</option>
                        <option value="option3">128</option>
                        <option value="option4">256</option>
                        <option value="option5">512</option>
                    </select>
                </div>

                <div className="col-md-12 d-flex align-items-center" >
                    <label className="form-label col-md-4">No. of Local Epochs</label>


                    <div className="col-md-8 range-display">
                        <label htmlFor="rangeInput" style={{ top: '-1.5rem', left: `calc(${thumbPositionEpochs}% - 12px)` }}>
                            {rangeValueEpochs}
                        </label>
                        <input
                            class="form-range"
                            id="rangeInput"
                            type="range"
                            min="10"
                            max="50"
                            step="10"
                            value={rangeValueEpochs}
                            onChange={(e) => setRangeValueEpochs(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-12 d-flex align-items-center" >
                    <label className="form-label col-md-4">No. of Communication Rounds</label>


                    <div className="col-md-8 range-display">
                        <label htmlFor="rangeInput" style={{ top: '-1.5rem', left: `calc(${thumbPositionComm}% - 12px)` }}>
                            {rangeValueComm}
                        </label>
                        <input
                            className="form-range"
                            id="rangeInput"
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={rangeValueComm}
                            onChange={(e) => setRangeValueComm(e.target.value)}
                        />
                    </div>
                </div>


                <div className="col-md-12 d-flex align-items-center" >
                    <label className="form-label col-md-4">No. of Users</label>


                    <div className="col-md-8 range-display">
                        <label htmlFor="rangeInput" style={{ top: '-1.5rem', left: `calc(${thumbPositionUser}% - 12px)` }}>
                            {rangeValueUser}
                        </label>
                        <input
                            className="form-range"
                            id="rangeInput"
                            type="range"
                            min="1"
                            max="100"
                            value={rangeValueUser}
                            onChange={(e) => setRangeValueUser(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-12 d-flex align-items-center" >
                    <label className="form-label col-md-4">Fraction of User</label>


                    <div className="col-md-8 range-display">
                        <label htmlFor="rangeInput" style={{ top: '-1.5rem', left: `calc(${thumbPositionFrac}% - 12px)` }}>
                            {rangeValueFrac}
                        </label>
                        <input
                            className="form-range"
                            id="rangeInput"
                            type="range"
                            min="0.01"
                            max="1"
                            step="0.01"
                            value={rangeValueFrac}
                            onChange={(e) => setRangeValueFrac(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-12 d-flex align-items-center" >
                    <label className="form-label col-md-4">Degree of nonIID or IID</label>

                    <div className="col-md-8 range-display">
                        <label htmlFor="rangeInput" style={{ top: '-1.5rem', left: `calc(${thumbPositionDeg}% - 12px)` }}>
                            {rangeValueDeg}
                        </label>
                        <input
                            className="form-range"
                            id="rangeInput"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={rangeValueDeg}
                            onChange={(e) => setRangeValueDeg(e.target.value)}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <span>0: nonIID</span>
                            <span>1: IID</span>
                        </div>
                    </div>
                </div>

                {/* Fix the location of the submit button and how it interacts with the form later*/}
                {/* <div class="col-12">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div> */}
            </form >
        </div >
    );
}

export default Form;
