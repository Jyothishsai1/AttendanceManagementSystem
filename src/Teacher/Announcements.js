// src/components/Teacher/Announcements.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const Announcements = () => {
  const [courses, setCourses] = useState([]);
  const [announcement, setAnnouncement] = useState({
    courseId: '',
    details: '',
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesRef = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesRef);
      const teacherCourses = courseSnapshot.docs
        .filter((doc) => doc.data().teacherId === currentUser.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(teacherCourses);
    };
    fetchCourses();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'announcements'), {
      ...announcement,
      teacherId: currentUser.uid,
      date: new Date(),
    });
    setAnnouncement({
      courseId: '',
      details: '',
    });
  };

  return (
    <div className="container">
      <h2>Send Announcement</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Course</label>
          <select
            className="form-control"
            value={announcement.courseId}
            onChange={(e) => setAnnouncement({ ...announcement, courseId: e.target.value })}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Announcement Details</label>
          <textarea
            className="form-control"
            value={announcement.details}
            onChange={(e) => setAnnouncement({ ...announcement, details: e.target.value })}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Send Announcement
        </button>
      </form>
    </div>
  );
};

export default Announcements;
