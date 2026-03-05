import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RoleSelection } from './pages/auth/RoleSelection';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { Home } from './pages/Home';
import { JoinDoctorPage } from './pages/JoinDoctorPage';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BookingPage } from './pages/BookingPage';
import { MyBookingsPage } from './pages/MyBookingsPage';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ className: 'font-semibold', duration: 4000 }} />
      <Routes>
        {/* Main Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route path="/patient" element={<Home />} />
            <Route path="/doctor" element={<Home />} />
            <Route path="/admin" element={<Home />} />
            <Route path="/join-doctor" element={<JoinDoctorPage />} />
            <Route path="/bookings/:doctorId" element={<BookingPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
          </Route>
        </Route>

        {/* Auth Pages (Stand-alone for now, though integrated in header) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/roles" element={<RoleSelection />} />

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
