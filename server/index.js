const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 1337;

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

    if (!firstName || !lastName || !username || !password || !userType) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = { id: Date.now(), userID, firstName, lastName, middleName, username, password, userType };
    users.push(newUser);
    saveData(USERS_FILE, users);

    res.status(201).json(newUser);
});

// Update a user
app.put('/updateuser/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { firstName, lastName, middleName, username, password, userType } = req.body;
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    users[userIndex] = { id, firstName, lastName, middleName, username, password, userType };
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

    const newStudent = { id: Date.now(), idNumber, firstName, lastName, middleName, course, year };
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

    students[studentIndex] = { id, idNumber, firstName, lastName, middleName, course, year };
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});