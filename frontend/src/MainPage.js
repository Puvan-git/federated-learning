import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './MainPage.css';
import Form from './Form.js';

export function MainPage() {
    const navigate = useNavigate();

    const handleFormData = (formData) => {
        console.log("Received form data in MainPage:", formData);
    }
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

        <div className="main-container">
            <header className="top-nav">Federated Learning Playground</header>

            <div className="content-area">
                <h1 className="main-title">Welcome to the Playground</h1>
                <p className="description">
                    Explore and understand federated learning interactively.
                </p>

                <Form onFormSubmit={handleFormData} />
                <button className="btn btn-primary btn-sm mx-3 px-5 py-2 mt-3" onClick={startTraining}>Start Training</button>

                {/* Add other components or elements here */}
            </div>
        </div>
    );
}