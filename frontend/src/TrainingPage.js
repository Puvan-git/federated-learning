import { useState, useEffect } from 'react';
import TrainingChart from './chart';
import { useSocket } from './SocketContext';
import { useLocation } from 'react-router-dom';

export function TrainingPage() {
    const location = useLocation();

    const formData = location.state.formData;

    const socket = useSocket();
    const [selectedClient, setSelectedClient] = useState("");  // Currently selected client

    const handleClientSelection = (e) => {
        const selected = e.target.value;
        setSelectedClient(selected);
    };

    const [clientsData, setClientsData] = useState({})

    const sortedClientIDs = Object.keys(clientsData).sort();

    const [trainingData, setTrainingData] = useState({
        rounds: [],
        losses: [],
        accuracies: []
    }); // Assuming data is an array of accuracy vs loss values

    const [trainingStatus, setTrainingStatus] = useState('ongoing'); // New state

    useEffect(() => {
        console.log("TrainingPage mounted!");
        socket.on('connect', (reason) => {
            console.log("Connected:", reason);
        });

        socket.emit('train', formData);
        console.log("Train event emitted");

        socket.on('train_confirmed', (message, ack) => {
            console.log(message);
            if (ack) ack();
        });

        socket.on('update_client', (newData) => {
            setClientsData(prevData => {
                let clientID = newData.clientID;
                if (!prevData[clientID]) {
                    prevData[clientID] = {
                        rounds: [],
                        losses: [],
                        accuracies: []
                    };
                }
                prevData[clientID].rounds.push(newData.round);
                prevData[clientID].losses.push(newData.loss);
                prevData[clientID].accuracies.push(newData.accuracy);
                return { ...prevData };
            });
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

            if (statusData.data === 'Training completed') {
                setTrainingStatus('completed');  // Update training status
            }
        });

        socket.on('reconnect_attempt', () => {
            console.log('Attempting to reconnect...');
        });

        socket.on('reconnect_error', (error) => {
            console.error('Reconnection error:', error);
        });

        socket.on('reconnect_failed', () => {
            console.error('Failed to reconnect.');
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
            console.log("training ended")
        };
    }, [socket, trainingStatus]);

    return (
        <div>
            <h1>Training Progress</h1>
            <h2>Global Model</h2>
            <TrainingChart data={trainingData} />

            <br></br>

            <div className="client-selection">
                <label htmlFor="clientSelect">Select a client: </label>
                <select id="clientSelect" placeholder="Please Choose..." value={selectedClient} onChange={handleClientSelection}>
                    <option value="" selected disabled>--Please choose a client--</option>
                    {sortedClientIDs.map(clientId => (
                        <option key={clientId} value={clientId}>{clientId}</option>
                    ))}
                </select>
            </div>


            <h2>Selected Client</h2>
            {selectedClient && clientsData[selectedClient] ? (
                <TrainingChart data={clientsData[selectedClient]} />
            ) : (
                <p>Select a client to view its data.</p>
            )}

            <p>Status: {trainingStatus}</p>
        </div>
    );
}
