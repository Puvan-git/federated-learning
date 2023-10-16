import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './MainPage';
import { TrainingPage } from './TrainingPage';
import { SocketProvider } from './SocketContext';


function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/training" element={<TrainingPage />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;