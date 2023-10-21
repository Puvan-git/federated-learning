import { useState, useEffect } from 'react';
import TrainingChart from './chart';
import { useSocket } from './SocketContext';

export function TrainingPage() {
    const socket = useSocket();
    // const [clients, setClients] = useState([]);  // List of available clients
    // const [selectedClient, setSelectedClient] = useState(null);  // Currently selected client

    // const handleClientSelection = (e) => {
    //     const selected = e.target.value;
    //     setSelectedClient(selected);
    //     socket.emit('client_selected', selected);
    // };

    const [clientData, setClientData] = useState({
        rounds: [],
        losses: [],
        accuracies: []
    })

    const [trainingData, setTrainingData] = useState({
        rounds: [],
        losses: [],
        accuracies: []
    }); // Assuming data is an array of accuracy vs loss values

    const [trainingStatus, setTrainingStatus] = useState('ongoing'); // New state
    const [dropdownValue_client, setDropdownValueClient] = useState("Client 1");

    useEffect(() => {
        console.log("TrainingPage mounted!");
        socket.on('connect', (reason) => {
            console.log("Connected:", reason);
        });


        socket.emit('train');
        console.log("Train event emitted");

        socket.on('train_confirmed', (message, ack) => {
            console.log(message);
            if (ack) ack();
        });

        // socket.on('clients_list', (data) => {
        //     setClients(data);
        // });

        socket.on('update_client', (newData) => {
            console.log("Client Data Received: ", newData);
            if (trainingStatus === 'ongoing') {
                setClientData(prevData => ({
                    rounds: [...prevData.rounds, newData.round],
                    losses: [...prevData.losses, newData.loss],
                    accuracies: [...prevData.accuracies, newData.accuracy]
                }));
            }
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

            // socket.disconnect();
            console.log("training ended")
        };
    }, [socket, trainingStatus]);

    return (
        <div>
            <h1>Training Progress</h1>
            <h2>Global Model</h2>
            <TrainingChart data={trainingData} />

            <br></br>

            {/* <select value={selectedClient} onChange={handleClientSelection}>
                <option value={null} selected disabled>Select a client</option>
                {clients.map(clientId => (
                    <option key={clientId} value={clientId}>{clientId}</option>
                ))}
            </select> */}
            <div className="client-selection">
                <label htmlFor="clientSelect">Select a client: </label>
                <select id="clientSelect" placeholder="Please Choose..." value={dropdownValue_client}>
                    <option value="" selection disabled>--Please choose a client--</option>
                </select>
            </div>


            <h2>Selected Client</h2>
            <TrainingChart data={clientData} />
            {/* {clientData.rounds.length > 0 ? (
                <TrainingChart data={clientData} />
            ) : (
                <p>No data available for the selected client.</p>
            )} */}

            <p>Status: {trainingStatus}</p>
        </div>
    );
}
