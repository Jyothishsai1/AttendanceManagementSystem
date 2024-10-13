import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Style from '../../styles/App.css';

const EditProfile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({ name: '', dob: '', role: '' });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };
    fetchData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'users', currentUser.uid);
    await updateDoc(docRef, {
      name: userData.name,
      dob: userData.dob,
    });
  };

  const handleCancel = () => {
    // Logic to handle cancel (e.g., navigate back or reset form)
    // For example, you could navigate back to the previous page
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={userData.name} 
            onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input 
            type="date" 
            className="form-control" 
            value={userData.dob} 
            onChange={(e) => setUserData({ ...userData, dob: e.target.value })} 
            required 
          />
        </div>
        <div className="button-container">
          <button type="button" className="btn btn-secondary mt-3" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary mt-3 saveBtn">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
