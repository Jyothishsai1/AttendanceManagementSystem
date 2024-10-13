import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Modal from 'react-modal';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    const userSnapshot = await getDocs(collection(db, 'users'));
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setDob(user.dob);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

  const handleEdit = async () => {
    const userDoc = doc(db, 'users', selectedUser.id);
    await updateDoc(userDoc, { name, dob });
    closeModal();
    fetchUsers(); // Refresh user list
  };

  const handleDelete = async (userId) => {
    const userDoc = doc(db, 'users', userId);
    await deleteDoc(userDoc);
    fetchUsers(); // Refresh user list
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
    <div className="container CourseContainer">
      <h2 className="mt-5 mb-5 text-center">Manage Users</h2>
      {users.length > 0 ? (
        <table className="table table-striped ms-auto me-auto">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.dob}</td>
                <td>
                <div className='d-flex'>
                  <button className="btn saveBtn me-2" onClick={() => openModal(user)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}

      {/* Edit Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} ariaHideApp={false}>
      <div className="ModalContainer">
        <h2>Edit User</h2>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div className='d-flex'>
        <button className="btn btn-primary mt-3" onClick={handleEdit}>
          Save
        </button>
        <button className="btn btn-secondary mt-3 ms-2" onClick={closeModal}>
          Cancel
        </button>
        </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
