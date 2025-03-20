import React, { useEffect, useState } from 'react';
import '../styles/ManageUsers.css';
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // NEW: Toggle password visibility

  const [formData, setFormData] = useState({
    userID: '',
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    password: '',
    userType: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await axios.get("http://localhost:1337/fetchusers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error Fetching users", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (isEditing) {
      const updatedUser = { id: editingId, ...formData };
      try {
        await axios.put(`http://localhost:1337/updateuser/${editingId}`, updatedUser);
        setUsers(prevUsers => prevUsers.map(user => user.id === editingId ? updatedUser : user));
      } catch (error) {
        console.error("Error updating user", error);
      }
    } else {
      const newUser = { id: Date.now(), ...formData };
      try {
        await axios.post("http://localhost:1337/adduser", newUser);
        setUsers(prevUsers => [...prevUsers, newUser]);
      } catch (error) {
        console.error("Error Adding user", error);
      }
    }
    closeModal();
  }

  async function confirmDelete() {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:1337/deleteuser/${userToDelete.id}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEdit(user) {
    setIsEditing(true);
    setEditingId(user.id);
    setFormData({
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || '',
      username: user.username,
      password: user.password,
      userType: user.userType || ''
    });
    setShowModal(true);
  }

  function handleDeleteClick(user) {
    setUserToDelete(user);
    setShowDeleteModal(true);
  }

  function openAddModal() {
    setIsEditing(false);
    setFormData({
      userID: '',
      firstName: '',
      lastName: '',
      middleName: '',
      username: '',
      password: '',
      userType: ''
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setIsEditing(false);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
    setUserToDelete(null);
  }

  return (
    <div className="user-container">
      <h1 className="user-title">USER MANAGEMENT</h1>
      <div className="table-container">
        <div className="table-header">
          <button className="add-button" onClick={openAddModal}>ADD USER</button>
        </div>
        <div className="overflow-x-auto">
          <table className="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Middle Name</th>
                <th>Username</th>
                <th>Password</th>
                <th>User Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.userID}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.middleName}</td>
                  <td>{user.username}</td>
                  <td>{user.password}</td> {/* Password is always visible */}
                  <td>{user.userType}</td>
                  <td className="action-buttons">
                    <a href="#" className="edit-link" onClick={(e) => { e.preventDefault(); handleEdit(user); }}>Edit</a>
                    <a href="#" className="delete-link" onClick={(e) => { e.preventDefault(); handleDeleteClick(user); }}>Delete</a>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>No users added yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? 'EDIT USER' : 'ADD USER'}</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input type="text" name="userID" value={formData.userID} onChange={handleInputChange} placeholder="User ID" className="input-field" required />
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="input-field" required />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="input-field" required />
                <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Middle Name" className="input-field" />
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="input-field" required />

                {/* Password Input with Toggle Visibility */}
                <div className="password-container">
                  <input 
                    type={showPassword ? "text" : "text"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    placeholder="Password" 
                    className="input-field" 
                    required 
                  />
                </div>

                <select name="userType" value={formData.userType} onChange={handleInputChange} className="input-field" required>
                  <option value="" disabled>Select User Type</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="User">User</option>
                </select>

                <div className="button-group">
                  <button type="submit" className="submit-button">{isEditing ? 'UPDATE USER' : 'ADD USER'}</button>
                  <button type="button" className="cancel-button" onClick={closeModal}>CANCEL</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
