// src/components/Teacher/GenerateAttendanceReport.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure you have this for automatic table generation
import AttendancePNG from "../assets/attendance.png";

const GenerateAttendanceReport = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendanceData, setAttendanceData] = useState({});

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
      } else {
        setStudents([]);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (selectedStudent) {
        const studentSnapshot = await getDocs(collection(db, 'users'));
        const student = studentSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .find(s => s.id === selectedStudent);
        
        setAttendanceData(student.attendance[selectedCourse] || {});
      }
    };
    fetchAttendanceData();
  }, [selectedStudent, selectedCourse]);

  const generateReport = () => {
    const doc = new jsPDF();
    const courseName = courses.find(course => course.id === selectedCourse)?.courseName;
    const today = new Date().toLocaleDateString();

    doc.setFontSize(20);
    doc.text("Attendance Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Course: ${courseName}`, 20, 30);
    doc.text(`Date: ${today}`, 20, 40);

    // Prepare attendance data for the PDF
    const headers = [["S.No", "Date", "Status"]];
    const data = Object.entries(attendanceData).map(([date, status], index) => [index + 1, date, status]);

    // Add headers and data to the PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: 50,
    });

    // Save the PDF
    doc.save(`attendance_report_${courseName}_${selectedStudent}.pdf`);

    // Confirmation Alert
    alert('Attendance report generated successfully!');
  };

  return (
    <div className="container courseContainer">
      <h2 className="mt-5 mb-5 text-center">Generate Attendance Report</h2>
      <div className='row'>
        <div className="col-2"></div>
        <div className='col-8'>
          <div className="form-group">
            <label>Select Course</label>
            <select
              className="form-control"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedStudent(''); // Reset student selection
              }}
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
            <div className="form-group mt-3">
              <label>Select Student</label>
              <select
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
          )}

          {selectedStudent && (
            <button className="btn btn-primary mt-3" onClick={generateReport}>
              Generate Attendance Report
            </button>
          )}
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default GenerateAttendanceReport;
