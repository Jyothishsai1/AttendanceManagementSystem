import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AttendanceCharts = () => {
  const [teachersCount, setTeachersCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [attendanceData, setAttendanceData] = useState({});
  const [courseNames, setCourseNames] = useState({}); // To hold course IDs and their names

  useEffect(() => {
    const fetchData = async () => {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const teachers = usersSnapshot.docs.filter(doc => doc.data().role === 'teacher').length;
      setTeachersCount(teachers);
      
      const students = usersSnapshot.docs.filter(doc => doc.data().role === 'student').length;
      setStudentsCount(students);

      // Initialize attendance map
      const attendanceMap = {};

      // Fetch course names
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = {};
      coursesSnapshot.forEach(courseDoc => {
        const courseData = courseDoc.data();
        courses[courseDoc.id] = courseData.courseName; // Map courseId to courseName
      });
      setCourseNames(courses);

      // Iterate through users to gather attendance data from students
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();

        if (userData.role === 'student' && userData.attendance) {
          // Iterate through each course's attendance records for this student
          userData.enrolledCourses.forEach(courseId => {
            if (!attendanceMap[courseId]) {
              attendanceMap[courseId] = Array(12).fill(0); // Initialize for each month
            }

            const records = userData.attendance[courseId]; // Assuming attendance is structured as per your previous objects
            for (const date in records) {
              const month = new Date(date).getMonth(); // Get month (0-11)
              if (records[date] === 'Present') {
                attendanceMap[courseId][month] += 1; // Increment present count
              }
            }
          });
        }
      });

      setAttendanceData(attendanceMap);
    };

    fetchData();
  }, []);

  // Prepare data for Pie Chart
  const pieData = {
    labels: ['Teachers', 'Students'],
    datasets: [
      {
        data: [teachersCount, studentsCount],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Prepare data for Bar Chart (Overall Monthly Attendance)
  const overallAttendanceData = {
    labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })), // Month names
    datasets: Object.entries(attendanceData).map(([courseId, attendance]) => ({
      label: `Course: ${courseNames[courseId] || courseId}`, // Use course name
      data: attendance,
      backgroundColor: '#42A5F5',
    })),
  };

  return (
    <div>
      <h2 class="text-center m-5">Attendance Overview</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h3>Teachers vs Students</h3>
          <Pie data={pieData} />
        </div>
        <div>
          <h3>Overall Attendance by Course (Month-wise)</h3>
          <Bar data={overallAttendanceData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceCharts;
