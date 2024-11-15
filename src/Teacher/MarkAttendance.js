// src/components/Teacher/MarkAttendance.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import AttendancePNG from "../assets/attendance.png";

const MarkAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceMarked, setAttendanceMarked] = useState({});
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  useEffect(() => {
    const fetchCourses = async () => {
      const courseSnapshot = await getDocs(collection(db, 'courses'));
      setCourses(courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedCourse) {
        const userSnapshot = await getDocs(collection(db, 'users'));
        const enrolledStudents = userSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(student => student.enrolledCourses && student.enrolledCourses.includes(selectedCourse));
        
        setStudents(enrolledStudents);
        checkAttendanceStatus(enrolledStudents); // Check attendance status after fetching students
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  const checkAttendanceStatus = (enrolledStudents) => {
    const status = {};
    enrolledStudents.forEach(student => {
      const attendance = student.attendance || {};
      if (attendance[selectedCourse] && attendance[selectedCourse][today]) {
        status[student.id] = true; // Attendance already marked for today
      } else {
        status[student.id] = false; // Attendance can be marked
      }
    });
    setAttendanceMarked(status);
  };

  const handleAttendance = async (studentId, status) => {
    const studentDocRef = doc(db, 'users', studentId);
    const attendanceKey = selectedCourse;

    // Update attendance status for the specific course and today's date
    await updateDoc(studentDocRef, {
      [`attendance.${attendanceKey}.${today}`]: status // Store attendance status
    });
    
    // Update local state to reflect that attendance has been marked
    setAttendanceMarked(prevState => ({ ...prevState, [studentId]: true }));
  };

  return (
    <div className="container courseContainer">
      <h2 className="mt-5 mb-5 text-center">Mark Attendance</h2>
      <div className='row'>
      <div className='col-7'>
      <div className="form-group">
        <label htmlFor='course'>Select Course</label>
        <select
          id='course'
          className="form-control"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      {students.length > 0 && (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                 <div className="d-flex">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleAttendance(student.id, 'Present')}
                    disabled={attendanceMarked[student.id]}
                  >
                    Present
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleAttendance(student.id, 'Absent')}
                    disabled={attendanceMarked[student.id]}
                  >
                    Absent
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
      <div className='col-4'>
      <img className="CourseImage" src={AttendancePNG} alt="Attendance Image" />
      </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
