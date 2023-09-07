import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

export function MainPage() {
    const navigate = useNavigate();

    const startTraining = () => {
        // Navigate to the training page
        navigate("/training");

        // Initialize WebSocket connection
        const socket = io('http://127.0.0.1:5000'); // Use your Flask server address
        // Emit the 'train' event to the server
        socket.emit('train');
        // Consider disconnecting socket if you don't need it anymore in this component
        socket.on('train_response', function (data) {
            console.log(data.message);
        });
    };

    return (
        <div>
            <button onClick={startTraining}>Start Training</button>
        </div>
    );
}
