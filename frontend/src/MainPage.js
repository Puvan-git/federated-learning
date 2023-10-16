import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

export function MainPage() {
    const navigate = useNavigate();

    const startTraining = () => {

        const socket = io('http://127.0.0.1:5000');

        // Emit the 'train' event to the server
        console.log('train event emitted');
        socket.emit('train');

        // Consider disconnecting socket if you don't need it anymore in this component
        socket.on('update_status', function (data) {
            console.log(data.message);
        });

        // Navigate to the training page
        navigate("/training");
    };

    return (
        <div>
            <button onClick={startTraining}>Start Training</button>
        </div>
    );
}
