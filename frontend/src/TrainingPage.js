import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TrainingChart from './chart';

export function TrainingPage() {
    const [trainingData, setTrainingData] = useState({
        rounds: [],
        losses: [],
        accuracies: []
    }); // Assuming data is an array of accuracy vs loss values

    const [trainingStatus, setTrainingStatus] = useState('ongoing'); // New state

    useEffect(() => {
        const socket = io('http://127.0.0.1:5000');

        socket.on('update', (newData) => {
            console.log("Data Received");
            // Update the component's state when its ongoing only 
            // with new data received from the server
            if (trainingStatus === 'ongoing') {
                setTrainingData(prevData => ({
                    rounds: [...prevData.rounds, newData.round],
                    losses: [...prevData.losses, newData.loss],
                    accuracies: [...prevData.accuracies, newData.accuracy]
                }));
            }
        });

        socket.on('update_status', (statusData) => {
            if (statusData.data === 'Training completed!') {
                setTrainingStatus('completed');  // Update training status
            }
        });

        console.log("hi");
        return () => {
            socket.disconnect();
        };
    }, [trainingStatus]);

    return (
        <div>
            <h1>Training Progress</h1>
            <TrainingChart data={trainingData} />
            {/* Optionally, can display the training status somewhere in the component */}
            <p>Status: {trainingStatus}</p>
        </div>
    );
}
