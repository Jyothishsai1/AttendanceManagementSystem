// src/components/Teacher/AttendanceHistory.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import AttendancePNG from "../assets/attendance.png";

const AttendanceHistory = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState({});
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendanceData, setAttendanceData] = useState({});

  // Fetch students and courses
  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      const userQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const userSnapshot = await getDocs(userQuery);
      const studentList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentList);

      const courseSnapshot = await getDocs(collection(db, 'courses'));
      const courseList = {};
      courseSnapshot.docs.forEach(doc => {
        const courseData = doc.data();
        courseList[doc.id] = courseData.courseName; // Map courseId to courseName
      });
      setCourses(courseList);
    };
    fetchStudentsAndCourses();
  }, []);

  // Fetch attendance data for the selected student
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (selectedStudent) {
        const studentDocRef = doc(db, 'users', selectedStudent);
        const studentDoc = await getDoc(studentDocRef);
        
        if (studentDoc.exists()) {
          setAttendanceData(studentDoc.data().attendance || {});
        }
      }
    };
    fetchAttendanceData();
  }, [selectedStudent]);

  // Group attendance data by course name
  const groupAttendanceByCourse = () => {
    const groupedData = {};
    
    Object.entries(attendanceData).forEach(([courseId, dates]) => {
      const courseName = courses[courseId] || courseId; // Get course name
      if (!groupedData[courseName]) {
        groupedData[courseName] = [];
      }
      Object.entries(dates).forEach(([date, status]) => {
        groupedData[courseName].push({ date, status });
      });
    });

    return groupedData;
  };

  // Render multiple tables for each course
  const renderAttendanceTables = () => {
    const groupedData = groupAttendanceByCourse();
    
    return Object.entries(groupedData).map(([courseName, records]) => (
      <div key={courseName} className="mt-4">
        <h5>{courseName}</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map(({ date, status }) => (
                <tr key={`${courseName}-${date}`}>
                  <td>{date}</td>
                  <td>{status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No attendance data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    ));
  };

  return (
    <div className="container courseContainer">
      <h2 className="mt-5 mb-5 text-center">Attendance History</h2>
      <div className='row'>
        <div className='col-7'>
          <div className="form-group">
            <label htmlFor='student'>Select Student</label>
            <select
              id='student'
              className="form-control"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && renderAttendanceTables()}
        </div>
        <div className='col-4'>
          <img className="CourseImage" src={AttendancePNG} alt="Attendance Image" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
