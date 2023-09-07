import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function TrainingChart({ data }) {
    const chartRef = useRef(null); // Reference to the chart

    const chartData = {
        labels: data.rounds,
        datasets: [
            {
                label: 'Loss',
                data: data.losses,
                borderColor: 'red',
                fill: false
            },
            {
                label: 'Accuracy',
                data: data.accuracies,
                borderColor: 'blue',
                fill: false
            }
        ]
    };

    const options = {
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                //type: 'linear'
            }
        }
    };

    return (
        <div>
            <Line data={chartData} options={options} ref={chartRef} />
        </div>
    );
}

export default TrainingChart;
