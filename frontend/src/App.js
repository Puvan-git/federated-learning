import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './MainPage';
import { TrainingPage } from './TrainingPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/training" element={<TrainingPage />} />
      </Routes>
    </Router>
  );
}

export default App;