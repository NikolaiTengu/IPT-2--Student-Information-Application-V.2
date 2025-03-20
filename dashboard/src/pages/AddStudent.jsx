import React, { useEffect, useState } from 'react';
import '../styles/AddStudent.css';
import axios from "axios";


const AddStudent = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    idNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    course: '',
    year: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const response = await axios.get("http://localhost:1337/fetchstudents");
      setStudents(response.data);
      console.log("Fetched students:", response.data);
    } catch (error) {
      console.error("Error Fetching students", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.idNumber || !formData.firstName || !formData.lastName || !formData.course || !formData.year) {
        alert("All fields are required!");
        return;
    }

    try {
        if (isEditing) {
            await axios.put(`http://localhost:1337/updatestudent/${editingId}`, formData);
            setStudents(prevStudents => prevStudents.map(student => student.id === editingId ? { ...student, ...formData } : student));
        } else {
            const response = await axios.post("http://localhost:1337/addstudent", formData);
            setStudents(prevStudents => [...prevStudents, response.data]);
        }
    } catch (error) {
        console.error("Error Adding/Updating student:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Something went wrong.");
    }

    closeModal();
}

  
  function resetForm() {
    setFormData({
      idNumber: '',
      firstName: '',
      lastName: '',
      middleName: '',
      course: '',
      year: ''
    });
  }
  
  function handleEdit(student) {
    setIsEditing(true);
    setEditingId(student.id);
    
    // this will populate the form with the student data
    setFormData({
      idNumber: student.idNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName || '',
      course: student.course,
      year: student.year
    });
    
    setShowModal(true);
  }
  
  function handleDeleteClick(student) {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  }
  
  async function confirmDelete() {
    if (!studentToDelete) return;
    
    try {
      setIsDeleting(true);
      
      console.log("Attempting to delete student with ID:", studentToDelete.id);
      await axios.delete(`http://localhost:1337/deletestudent/${studentToDelete.id}`);
      console.log("Student deleted:", studentToDelete);
      
      // update the students list
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== studentToDelete.id)
      );
      
      // same as closeDeleteModal()
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting student", error.response?.data || error.message);
      alert("Failed to delete student. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }
  
  function openAddModal() {
    setIsEditing(false);
    resetForm();
    setShowModal(true);
  }
  
  function closeModal() {
    setShowModal(false);
    setIsEditing(false);
    resetForm();
  }
  
  function closeDeleteModal() {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  }

  return (
    <div className="student-container">
      <h1 className="student-title">MANAGE STUDENTS!</h1>
      
      <div className="table-container">
        <div className="table-header">
          <button className="add-button" onClick={openAddModal}>
            ADD STUDENT
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Middle Name</th>
                <th>Course</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.idNumber}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.middleName}</td>
                  <td>{student.course}</td>
                  <td>{student.year}</td>
                  <td className="action-buttons">
                    <a 
                      href="#" 
                      className="edit-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(student);
                      }}
                    >
                      Edit
                    </a>
                    <a 
                      href="#" 
                      className="delete-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteClick(student);
                      }}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
                    No students added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* --> Add/Edit Modal <-- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? 'EDIT STUDENT' : 'ADD STUDENT'}</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="ID Number" 
                  className="input-field" 
                  required 
                />
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name" 
                  className="input-field" 
                  required 
                />
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name" 
                  className="input-field" 
                  required 
                />
                <input 
                  type="text" 
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Middle Name" 
                  className="input-field" 
                />
                <input 
                  type="text" 
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="Course" 
                  className="input-field" 
                  required 
                />
                <input 
                  type="text" 
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Year" 
                  className="input-field" 
                  required 
                />
                
                <div className="button-group">
                  <button type="submit" className="submit-button">
                    {isEditing ? 'UPDATE STUDENT' : 'ADD STUDENT'}
                  </button>
                  <button type="button" className="cancel-button" onClick={closeModal}>
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* ----> Delete Confirmation Modal <---- */}
      {showDeleteModal && studentToDelete && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h2>CONFIRM DELETE</h2>
              <button className="close-button" onClick={closeDeleteModal} disabled={isDeleting}>×</button>
            </div>
            <div className="modal-body">
              <p className="delete-message">
                Are you sure you want to delete student <strong>{studentToDelete.firstName} {studentToDelete.lastName}</strong> with ID <strong>{studentToDelete.idNumber}</strong>?
              </p>
              <p className="delete-warning">This action cannot be undone.</p>
              
              <div className="button-group">
                <button 
                  type="button" 
                  className="delete-confirm-button" 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'DELETING...' : 'DELETE'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStudent;