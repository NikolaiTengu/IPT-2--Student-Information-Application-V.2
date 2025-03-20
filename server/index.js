const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 1337;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// File paths
const USERS_FILE = 'users.json';
const STUDENTS_FILE = 'students.json';

// Read data from JSON files (or create empty files if they don't exist)
const readData = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

// Load initial data
let users = readData(USERS_FILE);
let students = readData(STUDENTS_FILE);
let nextUserId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
let nextStudentId = students.length > 0 ? Math.max(...students.map(student => student.id)) + 1 : 1;

// User type validation
const validUserTypes = ["admin", "moderator", "user"];
const validStudentType = "student";

// Fetch all users
app.get("/fetchusers", (req, res) => {
  res.json(users);
});

// Fetch all students
app.get("/fetchstudents", (req, res) => {
  res.json(students);
});

// Add a user
app.post("/adduser", (req, res) => {
  const { name, email, userType } = req.body;

  if (!name || !email || !userType) {
    return res.status(400).json({ message: "Name, email, and userType are required." });
  }

  if (!validUserTypes.includes(userType)) {
    return res.status(400).json({ message: `Invalid userType. Allowed values: ${validUserTypes.join(", ")}` });
  }

  const newUser = { id: nextUserId++, name, email, userType };
  users.push(newUser);
  writeData(USERS_FILE, users);

  res.status(201).json(newUser);
  console.log("Added user:", newUser);
});

// Add a student
app.post("/addstudent", (req, res) => {
  const { name, email, gradeLevel, userType } = req.body;

  if (!name || !email || !gradeLevel || !userType) {
    return res.status(400).json({ message: "Name, email, gradeLevel, and userType are required." });
  }

  if (userType !== validStudentType) {
    return res.status(400).json({ message: `Invalid userType. Students must have userType set to '${validStudentType}'` });
  }

  const newStudent = { id: nextStudentId++, name, email, gradeLevel, userType };
  students.push(newStudent);
  writeData(STUDENTS_FILE, students);

  res.status(201).json(newStudent);
  console.log("Added student:", newStudent);
});

// Update a user
app.put('/updateuser/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, userType } = req.body;
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!name || !email || !userType) {
    return res.status(400).json({ message: "Name, email, and userType are required." });
  }

  if (!validUserTypes.includes(userType)) {
    return res.status(400).json({ message: `Invalid userType. Allowed values: ${validUserTypes.join(", ")}` });
  }

  users[userIndex] = { id, name, email, userType };
  writeData(USERS_FILE, users);

  res.status(200).json({ message: 'User updated successfully', updatedUser: users[userIndex] });

  console.log(`Updated user with id: ${id}`);
});

// Update a student
app.put('/updatestudent/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, gradeLevel, userType } = req.body;
  const studentIndex = students.findIndex(student => student.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  if (!name || !email || !gradeLevel || !userType) {
    return res.status(400).json({ message: "Name, email, gradeLevel, and userType are required." });
  }

  if (userType !== validStudentType) {
    return res.status(400).json({ message: `Invalid userType. Students must have userType set to '${validStudentType}'` });
  }

  students[studentIndex] = { id, name, email, gradeLevel, userType };
  writeData(STUDENTS_FILE, students);

  res.status(200).json({ message: 'Student updated successfully', updatedStudent: students[studentIndex] });

  console.log(`Updated student with id: ${id}`);
});

// Delete a user
app.delete('/deleteuser/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  writeData(USERS_FILE, users);

  res.status(200).json({ message: 'User deleted successfully', deletedUser });

  console.log(`Deleted user with id: ${id}`);
});

// Delete a student
app.delete('/deletestudent/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(student => student.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];
  writeData(STUDENTS_FILE, students);

  res.status(200).json({ message: 'Student deleted successfully', deletedStudent });

  console.log(`Deleted student with id: ${id}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
