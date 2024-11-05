import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import Style from '../../styles/App.css';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleLogout = async () => {
    await logout(); // Ensure logout is completed
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid ms-5 me-5">
        <Link className="navbar-brand" to="/">Attendance System</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {currentUser && userRole === 'teacher' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/create-course">Create Course</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/mark-attendance">Mark Attendance</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/attendance-history">Attendance History</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/generate-report">Generate Report</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/schedule-meeting">Schedule Meetings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/announcements">Announcements</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/edit-profile">Profile</Link>
                </li>
              </>
            )}

            {/* Student Links */}
            {currentUser && userRole === 'student' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/enroll-courses">Enroll Courses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/view-courses">View Courses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/view-attendance">View Attendance</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/view-announcements">Course Announcements</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/meeting-schedule">Meeting Schedule</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/edit-profile">Profile</Link>
                </li>
              </>
            )}

            {/* Admin Links */}
            {currentUser && userRole === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/manage-users">Manage Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/statistics">Statistics</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/email-notifications">Email Notifications</Link>
                </li>
              </>
            )}

            {/* Auth Links */}
            {currentUser ? (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
