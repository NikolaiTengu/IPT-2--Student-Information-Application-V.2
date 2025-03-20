const express = require('express');
const cors = require('cors');
const app = express();
const port = 1337;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

let users = [];
let students = [];
let nextUserId = 1;
let nextStudentId = 1;

const validUserTypes = ["admin", "moderator", "user"];
const validStudentType = "student";

app.get("/fetchusers", (req, res) => {
  res.json(users);
});

app.get("/fetchstudents", (req, res) => {
  res.json(students);
});

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

  res.status(201).json(newUser);
  console.log("Added user:", newUser);
});

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

  res.status(201).json(newStudent);
  console.log("Added student:", newStudent);
});

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
  res.status(200).json({ message: 'User updated successfully', updatedUser: users[userIndex] });

  console.log(`Updated user with id: ${id}`);
});

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
  res.status(200).json({ message: 'Student updated successfully', updatedStudent: students[studentIndex] });

  console.log(`Updated student with id: ${id}`);
});

app.delete('/deleteuser/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  res.status(200).json({ message: 'User deleted successfully', deletedUser });

  console.log(`Deleted user with id: ${id}`);
});

app.delete('/deletestudent/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(student => student.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];
  res.status(200).json({ message: 'Student deleted successfully', deletedStudent });

  console.log(`Deleted student with id: ${id}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
