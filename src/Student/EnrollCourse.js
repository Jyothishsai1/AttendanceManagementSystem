import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDoc, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const EnrollCourse = () => {
  const [courses, setCourses] = useState([]);
  const { currentUser } = useAuth();
  const [userCourses, setUserCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courseSnapshot = await getDocs(collection(db, 'courses'));
      setCourses(courseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchUserCourses = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserCourses(userDoc.data().enrolledCourses || []);
      }
    };
    fetchUserCourses();
  }, [currentUser]);

  const handleEnroll = async (courseId) => {
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      enrolledCourses: arrayUnion(courseId),
    });
    alert('Enrolled successfully!');
    setUserCourses((prevCourses) => [...prevCourses, courseId]); // Update state
  };

  return (
    <div className="container">
      <h2 className="mt-5 mb-5 text-center">Enroll in Courses</h2>
      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-4 mb-4">
            <div className="card position-relative">
              <div className="card-body text-white d-flex justify-content-between align-items-start position-relative">
                <div className="course-info ms-5 ps-5 pt-3">
                  <p className="card-title">{course.courseName}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
                <img 
                  src="https://lh5.googleusercontent.com/proxy/_8HGlErktQunjK2lRrrspEaRiBe2zO61rhdfFE8jatszZthet0CW8J57UQGLghGToXEZAfF1dEiOdVQ0-sk4cP_H" 
                  alt="Profile" 
                  className="profile-image" 
                />
              </div>
              <div className="card-body bg-white">
                <p className="card-text mt-5">{course.description}</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleEnroll(course.id)} 
                  disabled={userCourses.includes(course.id)} // Disable if enrolled
                >
                  {userCourses.includes(course.id) ? 'Enrolled' : 'Enroll'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollCourse;
