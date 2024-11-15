import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { setDoc, doc } from 'firebase/firestore';
import Style from '../../styles/App.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [role, setRole] = useState('student');
  const [dob, setDob] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await signup(email, password);
      const userId = userCredential.user.uid;
      await setDoc(doc(db, 'users', userId), {
        name,
        email,
        role,
        dob,
        createdAt: new Date(),
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            id="name"
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role" 
            className="form-control" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            id="dob" 
            type="date" 
            className="form-control" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input 
            id='password'
            type="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="conPassword">Confirm Password</label>
          <input 
            id="conPassword"
            type="password" 
            className="form-control" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3 registerBtn">Register</button>
      </form>
    </div>
  );
};

export default Register;
