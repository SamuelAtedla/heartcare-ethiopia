import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import LandingPage from "./pages/LandingPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
