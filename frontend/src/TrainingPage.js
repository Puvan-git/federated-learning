import { useState, useEffect } from 'react';
import TrainingChart from './chart';
import { useSocket } from './SocketContext';

export function TrainingPage() {
    const socket = useSocket();

    const [trainingData, setTrainingData] = useState({
        rounds: [],
        losses: [],
        accuracies: []
    }); // Assuming data is an array of accuracy vs loss values

    const [trainingStatus, setTrainingStatus] = useState('ongoing'); // New state

    useEffect(() => {
        console.log("TrainingPage mounted!");

        socket.emit('train');
        console.log("Train event emitted");


        socket.on('connect', (reason) => {
            console.warn("Connected:", reason);
        });


        socket.on('update', (newData) => {
            console.log("Data Received: ", newData);
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
            console.log("Received status update:", statusData);

            if (statusData.data === 'Training completed!') {
                setTrainingStatus('completed');  // Update training status
            }
        });

        socket.on('connect_error', (error) => {
            console.error("Connection Error:", error);
        });

        socket.on('disconnect', (reason) => {
            console.warn("Disconnected:", reason);
        });

        socket.on('error', (error) => {
            console.error("Socket Error:", error);
        });


        return () => {
            console.log("TrainingPage unmounted!");

            // socket.disconnect();
            console.log("training ended")
        };
    }, [socket, trainingStatus]);

    return (
        <div>
            <h1>Training Progress</h1>
            <TrainingChart data={trainingData} key={Date.now()} />
            {/* Optionally, can display the training status somewhere in the component */}
            <p>Status: {trainingStatus}</p>
        </div>
    );
}
