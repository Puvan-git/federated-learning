import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './MainPage';
import { TrainingPage } from './TrainingPage';
import { SocketProvider } from './SocketContext';
import { Test } from './Test';
import react from 'react';


function App() {
  return (
    <div className="App">
      <Test />
    </div>
    // <SocketProvider>
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<MainPage />} />
    //       <Route path="/training" element={<TrainingPage />} />
    //     </Routes>
    //   </Router>
    // </SocketProvider>
  );
}

export default App;