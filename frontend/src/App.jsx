import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/common/NotificationContainer';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import ServicesPage from "./pages/ServicesPage";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RegisterPatient from "./pages/RegisterPatient";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import PatientRecords from "./pages/Patient/PatientRecords";
import PatientSettings from "./pages/Patient/PatientSettings";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorSettings from "./pages/Doctor/DoctorSettings";
import ScheduleManager from "./pages/Doctor/ScheduleManager";
import FinanceManager from "./pages/Doctor/components/FinanceManager";
import PatientArchive from "./pages/Doctor/components/PatientArchive";
import HomeRoute from "./components/HomeRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <NotificationContainer />
          <Routes>
            {/* Public Routes */}

            {/* Public Routes */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/register" element={<RegisterPatient />} />

            {/* Protected Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute roles={['patient']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="records" element={<PatientRecords />} />
              <Route path="settings" element={<PatientSettings />} />
              {/* Redirect root /patient to /patient/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Protected Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute roles={['doctor']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="finance" element={<FinanceManager />} />
              <Route path="archive" element={<PatientArchive />} />
              <Route path="settings" element={<DoctorSettings />} />
              <Route path="schedule" element={<ScheduleManager />} />
              {/* Redirect root /doctor to /doctor/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
