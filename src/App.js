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
import CreateCourse from './Teacher/CreateCourse'; // Course creation for teachers
import PrivateRoute from './routes/PrivateRoute'; // For private routes
import RoleBasedRoute from './routes/RoleBasedRoute'; // For role-based routing
import MarkAttendance from './Teacher/MarkAttendance';
import EnrollCourse from './Student/EnrollCourse';
import ViewCourses from './Student/ViewCourses';
import ScheduleMeeting from './Teacher/ScheduleMeeting';
import ManageUsers from './Admin/ManageUsers';
import AttendanceHistory from './Teacher/AttendanceHistory';
import GenerateAttendanceReport from './Teacher/GenerateAttendanceReport';
import AttendanceView from './Student/AttendanceView';
import MeetingSchedule from './Student/MeetingSchedule';
import Statistics from './Admin/Statistics';
import EmailNotifications from './Admin/EmailNotifications';
import Announcements from './Teacher/Announcements';
import ViewAnnouncements from './Student/ViewAnnouncements';


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
              <Route path="/student/dashboard" element={<EnrollCourse />} />
              <Route path="/teacher/dashboard" element={<CreateCourse />} />
              <Route path="/admin/dashboard" element={<ManageUsers />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/admin/statistics" element={<Statistics />} />
              <Route path="/admin/email-notifications" element={<EmailNotifications />} />
              <Route path="/student/enroll-courses" element={<EnrollCourse />} />
              <Route path="/student/view-courses" element={<ViewCourses />} />
              <Route path="/student/view-attendance" element={<AttendanceView />} />
              <Route path="/student/meeting-schedule" element={<MeetingSchedule />} />
              <Route path="/student/view-announcements" element={<ViewAnnouncements />} />
              <Route path="/teacher/create-course" element={<CreateCourse />} />
              <Route path="/teacher/mark-attendance" element={<MarkAttendance />} />
              <Route path="/teacher/schedule-meeting" element={<ScheduleMeeting />} />
              <Route path="/teacher/attendance-history" element={<AttendanceHistory />} />
              <Route path="/teacher/generate-report" element={<GenerateAttendanceReport />} />
              <Route path="/teacher/announcements" element={<Announcements />} />
              {/* Add other protected routes as needed */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
