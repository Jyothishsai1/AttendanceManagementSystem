import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import SuccessModal from '../Admin/SuccessModal'; // Import the SuccessModal component

const Announcements = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      console.log(currentUser.email);
      const courseList = coursesSnapshot.docs
        .filter(doc => doc.data().createdBy === currentUser.email)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    };

    fetchCourses();
  }, [currentUser.email]);
console.log(currentUser);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCourse && announcement) {
      try {
        await addDoc(collection(db, 'announcements'), {
          courseId: selectedCourse,
          announcement,
          createdAt: Timestamp.now(),
        });

        setShowModal(true);
        setSelectedCourse('');
        setAnnouncement('');
      } catch (error) {
        console.error('Error creating announcement: ', error);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-5">Create Announcement</h2>
      <div className='row'>
      <div className='col-2'></div>
      <div className='col-8'>
      <form onSubmit={handleSubmit} className="ms-auto">
        <div className="form-group">
          <label>Select Course</label>
          <select
            className="form-control"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Announcement</label>
          <textarea
            className="form-control"
            rows="4"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
        <button type="submit" className="btn btn-primary">Send Announcement</button>
        </div>
      </form>
      </div>
      <div className='col-2'></div>
      </div>
      {/* Success Modal */}
      <SuccessModal
        show={showModal}
        onHide={() => setShowModal(false)}
        message="Announcement sent successfully!"
      />
    </div>
  );
};

export default Announcements;
