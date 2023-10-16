import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export function MainPage() {
    const navigate = useNavigate();

    const startTraining = () => {
        // Navigate to the training page
        navigate("/training");
    };

    useEffect(() => {
        // This is just a log for when the component mounts.
        console.log("MainPage mounted!");

        // This cleanup function will run when the component is about to unmount.
        return () => {
            console.log("MainPage unmounting...");
        };
    }, []);  // The empty dependency array ensures this useEffect runs only once, similar to componentDidMount and componentWillUnmount lifecycle methods.

    return (
        <div>
            <button onClick={startTraining}>Start Training</button>
        </div>
    );
}