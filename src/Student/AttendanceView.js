import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import AttendanceCalendar from '../components/Common/Calendar'; // Updated import

const AttendanceView = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    const fetchCoursesAndAttendance = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const enrolledCourses = userData.enrolledCourses || [];

        // Fetch courses and filter based on enrolled courses
        const courseSnapshot = await getDocs(collection(db, 'courses'));
        const coursesMap = {};
        
        courseSnapshot.docs.forEach(doc => {
          if (enrolledCourses.includes(doc.id)) {
            coursesMap[doc.id] = doc.data().courseName;
          }
        });

        setCourses(coursesMap);

        // Fetch attendance data
        const attendance = userData.attendance || {};
        const attendanceArray = [];

        for (const courseId in attendance) {
          const courseAttendance = attendance[courseId];
          for (const date in courseAttendance) {
            attendanceArray.push({
              courseId,
              date,
              status: courseAttendance[date],
            });
          }
        }
        setAttendanceData(attendanceArray);
      }
    };

    fetchCoursesAndAttendance();
  }, [currentUser]);

  return (
    <div className="container">
      <h2 className='text-center mt-5'>Your Attendance</h2>
      <div className='row'>
      <div className='col-2'></div>
      <div className='col-8'>
      <div className="form-group">
        <label htmlFor='course'>Select Course</label>
        <select
          id='course'
          className="form-control"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {Object.entries(courses).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>
      </div>
      <div className='col-2'></div>
      </div>
      {selectedCourse && (
        <AttendanceCalendar 
          attendanceData={attendanceData.filter(record => record.courseId === selectedCourse)} 
        />
      )}
    </div>
  );
};

export default AttendanceView;
