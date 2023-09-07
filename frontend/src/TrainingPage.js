import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export function TrainingPage() {
    const [data, setData] = useState([]); // Assuming data is an array of accuracy vs loss values

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('update', (newData) => {
            // Update the component's state with new data received from the server
            setData(prevData => [...prevData, newData]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            {/* Visualization code here, e.g., a graph that gets updated based on `data` */}
        </div>
    );
}
