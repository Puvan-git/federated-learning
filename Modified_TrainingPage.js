
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TrainingChart from './chart';

export function TrainingPage() {
    const [trainingData, setTrainingData] = useState({
        rounds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        losses: [0.34, 1.41, 0.22, 1.11, 0.83, 0.71, 0.99, 1.3, 0.88, 1.48],
        accuracies: [0.7, 0.58, 0.68, 0.85, 0.64, 0.8, 0.99, 0.76, 0.85, 0.59]
    });

    useEffect(() => {
        const socket = io('http://127.0.0.1:5000');

        socket.on('update', (newData) => {
            // Update the component's state with new data received from the server
            setTrainingData(prevData => ({
                rounds: [...prevData.rounds, newData.round],
                losses: [...prevData.losses, newData.loss],
                accuracies: [...prevData.accuracies, newData.accuracy]
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Training Progress</h1>
            <TrainingChart data={trainingData} />
        </div>
    );
}

export default TrainingPage;
