const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 1337;
const Student = require('./models/student.model');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/StudentInformationSystem');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const USERS_FILE = './users.json';
const STUDENTS_FILE = './students.json';

// Load data from JSON files
function loadData(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (error) {
        return [];
    }
}

// Save data to JSON files
function saveData(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
}

let users = loadData(USERS_FILE);
let students = loadData(STUDENTS_FILE);

// Fetch all users
app.get("/fetchusers", (req, res) => {
    res.json(users);
});

// Fetch all students
app.get("/fetchstudents", (req, res) => {
    res.json(students);
});

// Add a new user
app.post("/adduser", (req, res) => {
    const { userID, firstName, lastName, middleName, username, password, userType } = req.body;

    if (!userID || !firstName || !lastName || !username || !password || !userType) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if userID already exists
    const existingUser = users.find(user => user.userID === userID);
    if (existingUser) {
        return res.status(400).json({ message: "User ID already exists" });
    }

    // Use the provided userID as the unique identifier
    const newUser = { 
        id: Date.now(), // Internal ID for database operations
        userID,        // User-provided ID that matches with student ID
        firstName, 
        lastName, 
        middleName, 
        username, 
        password, 
        userType 
    };
    
    users.push(newUser);
    saveData(USERS_FILE, users);

    res.status(201).json(newUser);
});

// Update a user
app.put('/updateuser/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { userID, firstName, lastName, middleName, username, password, userType } = req.body;
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    // Keep the same id but update other fields including userID
    users[userIndex] = { 
        id: users[userIndex].id, 
        userID: userID || users[userIndex].userID,
        firstName: firstName || users[userIndex].firstName, 
        lastName: lastName || users[userIndex].lastName, 
        middleName: middleName || users[userIndex].middleName, 
        username: username || users[userIndex].username, 
        password: password || users[userIndex].password, 
        userType: userType || users[userIndex].userType 
    };
    
    saveData(USERS_FILE, users);

    res.status(200).json({ message: 'User updated successfully', updatedUser: users[userIndex] });
});

// Delete a user
app.delete('/deleteuser/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    const deletedUser = users.splice(userIndex, 1)[0];
    saveData(USERS_FILE, users);

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
});

// Add a new student
app.post("/addstudent", (req, res) => {
    const { idNumber, firstName, lastName, middleName, course, year } = req.body;

    if (!idNumber || !firstName || !lastName || !course || !year) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if student ID already exists
    const existingStudent = students.find(student => student.idNumber === idNumber);
    if (existingStudent) {
        return res.status(400).json({ message: "Student ID already exists" });
    }

    const newStudent = { 
        id: Date.now(), // Internal ID for database operations
        idNumber,      // This should match userID in the users collection when applicable
        firstName, 
        lastName, 
        middleName, 
        course, 
        year 
    };
    
    students.push(newStudent);
    saveData(STUDENTS_FILE, students);

    res.status(201).json(newStudent);
});

// Update a student
app.put('/updatestudent/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { idNumber, firstName, lastName, middleName, course, year } = req.body;
    const studentIndex = students.findIndex(student => student.id === id);

    if (studentIndex === -1) return res.status(404).json({ message: 'Student not found' });

    // Keep the same id but update other fields including idNumber
    students[studentIndex] = { 
        id: students[studentIndex].id, 
        idNumber: idNumber || students[studentIndex].idNumber,
        firstName: firstName || students[studentIndex].firstName, 
        lastName: lastName || students[studentIndex].lastName, 
        middleName: middleName || students[studentIndex].middleName, 
        course: course || students[studentIndex].course, 
        year: year || students[studentIndex].year 
    };
    
    saveData(STUDENTS_FILE, students);

    res.status(200).json({ message: 'Student updated successfully', updatedStudent: students[studentIndex] });
});

// Delete a student
app.delete('/deletestudent/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const studentIndex = students.findIndex(student => student.id === id);

    if (studentIndex === -1) return res.status(404).json({ message: 'Student not found' });

    const deletedStudent = students.splice(studentIndex, 1)[0];
    saveData(STUDENTS_FILE, students);

    res.status(200).json({ message: 'Student deleted successfully', deletedStudent });
});

// Find user by student ID
app.get('/finduserbystudentid/:idNumber', (req, res) => {
    const idNumber = req.params.idNumber;
    const user = users.find(user => user.userID === idNumber);
    
    if (!user) return res.status(404).json({ message: 'No user found with this student ID' });
    
    res.status(200).json(user);
});

// Find student by user ID
app.get('/findstudentuserid/:userID', (req, res) => {
    const userID = req.params.userID;
    const student = students.find(student => student.idNumber === userID);
    
    if (!student) return res.status(404).json({ message: 'No student found with this user ID' });
    
    res.status(200).json(student);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});