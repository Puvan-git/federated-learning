import React from 'react';
import { Line } from 'react-chartjs-2';

const TrainingChart = ({ data }) => {

    const chartData = {
        labels: data.rounds,
        datasets: [
            {
                label: 'Loss',
                data: data.losses,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            },
            {
                label: 'Accuracy',
                data: data.accuracies,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {};

    return (
        <div>
            <Line data={chartData} options={options} key={data.rounds.length} />
        </div>
    );
}

export default TrainingChart;
