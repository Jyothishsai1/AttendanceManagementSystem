// src/components/Teacher/CreateCourse.js
import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import CoursePNG from "../assets/course.png";
import { useAuth } from '../context/AuthContext'; // Adjust the import based on your auth context setup

const CreateCourse = () => {
  const { currentUser } = useAuth(); // Assuming useAuth provides currentUser
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'courses'), {
      courseName,
      description,
      duration,
      createdBy: currentUser.email, // Include the current user's email
    });
    setCourseName('');
    setDescription('');
    setDuration('');
  };

  return (
    <div className="container courseContainer">
      <h2 className="mt-5 mb-5 text-center">Create Course</h2>
      <div className="row">
        <div className="col-7">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor='name'>Course Name</label>
              <input
                id='name'
                type="text"
                className="form-control"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                placeholder="Enter Course Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor='desc'>Course Description</label>
              <input
                id='desc'
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Description"
              />
            </div>
            <div className="form-group">
              <label htmlFor='duration'>Course Duration (in weeks)</label>
              <input
                id='duration'
                type="number"
                className="form-control"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                placeholder="Duration"
              />
            </div>
            <button type="submit" className="btn btn-primary saveBtn mt-3 full-width-btn">Create Course</button>
          </form>
        </div>
        <div className="col-4">
          <img src={CoursePNG} className="CourseImage" alt="Course Image" />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
