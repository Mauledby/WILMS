import './App.css';
import {
  BrowserRouter, Routes,
  Route, Redirect, Link,
} from 'react-router-dom';
import { useContext } from 'react';
import {AuthProvider} from './context/AuthContext';
import Tracker from './pages/dashboard';
import Calendar from './pages/calendar_page';
import MyReservations from './pages/my_reservations';
import AttendanceLogs from './pages/attendance_logs';
import Attendance from './pages/attendance';
import Login from './pages/login_page';

function App() {
  document.title="WILMS BOOKING SYSTEM"
  return (
    <div className="App">
     
        <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route exact path="/api/login" element={<Login />} />
            {/* <Route exact path="/" element={<Login />} /> */}
            <Route exact path="/api/tracker" element={<Tracker />} />
            <Route exact path="/api/calendar" element={<Calendar />} />
            <Route exact path="/api/logs" element={<AttendanceLogs />} />
            <Route exact path="/api/bookings" element={<MyReservations />} />
            <Route exact path="/attendance" element={<Attendance />} />
            <Route exact path="/api/attendance" element={<Attendance />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
