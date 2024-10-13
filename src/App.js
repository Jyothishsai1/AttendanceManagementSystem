// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { AuthProvider } from './context/AuthContext'; // Your Auth context
import Navbar from './components/Common/Navbar'; // Navbar component
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EditProfile from './components/Auth/EditProfile';
import StudentDashboard from './Student/ViewCourses'; // You can replace this with the actual dashboard
import TeacherDashboard from './Teacher/AttendanceHistory'; // Placeholder for Teacher Dashboard
import AdminDashboard from './Admin/ManageUsers'; // Placeholder for Admin Dashboard
import AttendanceView from './Student/AttendanceView'; // Attendance view for students
import CreateCourse from './Teacher/CreateCourse'; // Course creation for teachers
import PrivateRoute from './routes/PrivateRoute'; // For private routes
import RoleBasedRoute from './routes/RoleBasedRoute'; // For role-based routing
import MarkAttendance from './Teacher/MarkAttendance';
import EnrollCourse from './Student/EnrollCourse';
import ViewCourses from './Student/ViewCourses';
import ScheduleMeeting from './Teacher/ScheduleMeeting';
import ManageUsers from './Admin/ManageUsers';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            
            {/* Protected Routes */}
            <Route >
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/student/attendance" element={<AttendanceView />} />
              <Route path="/student/enroll-courses" element={<EnrollCourse />} />
              <Route path="/student/view-courses" element={<ViewCourses />} />
              <Route path="/teacher/create-course" element={<CreateCourse />} />
              <Route path="/teacher/mark-attendance" element={<MarkAttendance />} />
              {/* Add other protected routes as needed */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
