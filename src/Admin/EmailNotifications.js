import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import SuccessModal from './SuccessModal'; // Import the SuccessModal component

const EmailNotifications = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [modalShow, setModalShow] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const students = usersSnapshot.docs.filter(doc => doc.data().role === 'student');
      
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = {};
      coursesSnapshot.forEach(courseDoc => {
        const courseData = courseDoc.data();
        courses[courseDoc.id] = courseData.courseName; // Map courseId to courseName
      });

      const attendanceData = {};

      students.forEach(studentDoc => {
        const studentData = studentDoc.data();
        studentData.enrolledCourses.forEach(courseId => {
          if (!attendanceData[studentDoc.id]) {
            attendanceData[studentDoc.id] = {
              studentName: studentData.name,
              email: studentData.email,
              courseName: courses[courseId] || courseId,
              overallAttendance: 0,
              totalClasses: 0,
            };
          }

          const records = studentData.attendance[courseId] || {};
          Object.values(records).forEach(status => {
            attendanceData[studentDoc.id].totalClasses += 1;
            if (status === 'Present') {
              attendanceData[studentDoc.id].overallAttendance += 1;
            }
          });
        });
      });

      setStudentsData(Object.values(attendanceData));
    };

    fetchData();
  }, []);

  const sendEmail = (studentName, courseName, attendancePercentage, email) => {
    const templateParams = {
      to_name: studentName,
      course_name: courseName,
      attendance_percentage: attendancePercentage.toFixed(2),
      message: `Your attendance for the course ${courseName} is ${attendancePercentage.toFixed(2)}%.`,
      to_email: email,
    };

    emailjs.send('service_u9cirnp', 'template_6d8pkji', templateParams, 'g7Vh5HcGYrAQOBG-K')
      .then(response => {
        console.log('Email sent successfully!', response.status, response.text);
        setModalMessage('Email sent successfully!');
        setModalShow(true); // Show the modal
      })
      .catch(err => {
        console.error('Failed to send email:', err);
        setModalMessage('Failed to send email. Please try again.');
        setModalShow(true); // Show the modal with error message
      });
  };

  return (
    <div className="container email-notifications-container">
      <h2 className="mt-5 mb-5 text-center">Email Notifications</h2>
      {studentsData.length > 0 ? (
        <table className="table table-striped ms-auto me-auto">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course Name</th>
              <th>Overall Attendance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map(student => {
              const attendancePercentage = student.totalClasses > 0 
                ? (student.overallAttendance / student.totalClasses) * 100 
                : 0;

              return (
                <tr key={student.studentName}>
                  <td>{student.studentName}</td>
                  <td>{student.courseName}</td>
                  <td>{attendancePercentage.toFixed(2)}%</td>
                  <td>
                    <button onClick={() => sendEmail(student.studentName, student.courseName, attendancePercentage, student.email)} className="btn saveBtn">
                      Send Email
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No students found.</p>
      )}

      {/* Success Modal */}
      <SuccessModal 
        show={modalShow} 
        onHide={() => setModalShow(false)} 
        message={modalMessage} 
      />
    </div>
  );
};

export default EmailNotifications;
