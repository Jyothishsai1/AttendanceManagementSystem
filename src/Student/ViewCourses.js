import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Modal from 'react-modal';

const ViewCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserCourses = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setEnrolledCourses(userSnap.data().enrolledCourses || []);
      }
    };
    fetchUserCourses();
  }, [currentUser]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesRef = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesRef);
      const enrolled = courseSnapshot.docs
        .filter((doc) => enrolledCourses.includes(doc.id))
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(enrolled);
    };
    if (enrolledCourses.length > 0) {
      fetchCourses();
    }
  }, [enrolledCourses]);

  const openModal = (course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',  // Adjust width as needed
    maxWidth: '600px', // Maximum width
    height: 'auto', // Adjust height as needed
    padding: '20px',
    borderRadius: '10px',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
};

  return (
    <div className="container">
      <h2 className="mt-5 mb-5 text-center">Your Enrolled Courses</h2>
      {courses.length > 0 ? (
        <table className="table table-striped ms-auto me-auto">
          <thead style={{ backgroundColor: '#01008A', color: 'white' }}>
            <tr>
              <th>Course Name</th>
              <th>Course Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseName}</td>
                <td>{course.duration} weeks</td>
                <td>
                  <button className="btn btn-primary viewBtn" onClick={() => openModal(course)}>
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You are not enrolled in any courses yet.</p>
      )}

      {selectedCourse && (
        <Modal isOpen={true} onRequestClose={closeModal}  style={customStyles} ariaHideApp={false}>
          <h2>{selectedCourse.courseName}</h2>
          <p><strong>Duration:</strong> {selectedCourse.duration} weeks</p>
          <p>{selectedCourse.description}</p>
          <button className="btn btn-primary" onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default ViewCourses;
