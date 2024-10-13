// src/components/Student/AttendanceView.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Calendar from '../components/Common/Calendar'; // Assuming you have a Calendar component

const AttendanceView = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setAttendanceData(userSnap.data().attendance || []); // Adjust according to your data structure
      }
    };

    fetchAttendanceData();
  }, [currentUser]);

  return (
    <div className="container">
      <h2>Your Attendance</h2>
      <Calendar attendanceData={attendanceData} />
    </div>
  );
};

export default AttendanceView;
