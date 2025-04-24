const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 1337;
const Student = require('./models/student.model');
const User = require('./models/user.model');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/StudentInformationSystem')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

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

app.get("/fetchusers", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// Fetch all students
app.get("/fetchstudents", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error: error.message });
    }
});

// Add a new user
app.post("/adduser", async (req, res) => {
    const { userID, firstName, lastName, middleName, username, password, userType } = req.body;

    if (!userID || !firstName || !lastName || !username || !password || !userType) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if userID already exists
        const existingUser = await User.findOne({ userID });
        if (existingUser) {
            return res.status(400).json({ message: "User ID already exists" });
        }

        // Check if username is taken
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Create new user document
        const newUser = new User({
            userID,
            firstName,
            lastName,
            middleName,
            username,
            password, // Note: In production, you should hash passwords
            userType
        });

        // Save to database
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error adding user", error: error.message });
    }
});

// Update a user
app.put('/updateuser/:id', async (req, res) => {
    const id = req.params.id;
    const { userID, firstName, lastName, middleName, username, password, userType } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                userID,
                firstName,
                lastName,
                middleName,
                username,
                password,
                userType
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

// Delete a user
app.delete('/deleteuser/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

// Add a new student
app.post("/addstudent", async (req, res) => {
    const { idNumber, firstName, lastName, middleName, course, year } = req.body;

    if (!idNumber || !firstName || !lastName || !course || !year) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if student ID already exists
        const existingStudent = await Student.findOne({ idNumber });
        if (existingStudent) {
            return res.status(400).json({ message: "Student ID already exists" });
        }

        // Create new student document
        const newStudent = new Student({
            idNumber,
            firstName,
            lastName,
            middleName,
            course,
            year
        });

        // Save to database
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: "Error adding student", error: error.message });
    }
});

// Update a student
app.put('/updatestudent/:id', async (req, res) => {
    const id = req.params.id;
    const { idNumber, firstName, lastName, middleName, course, year } = req.body;

    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                idNumber,
                firstName,
                lastName,
                middleName,
                course,
                year
            },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully', updatedStudent });
    } catch (error) {
        res.status(500).json({ message: "Error updating student", error: error.message });
    }
});

// Delete a student
app.delete('/deletestudent/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully', deletedStudent });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error: error.message });
    }
});

// Find user by student ID
app.get('/finduserbystudentid/:idNumber', async (req, res) => {
    const idNumber = req.params.idNumber;
    
    try {
        const user = await User.findOne({ userID: idNumber });
        
        if (!user) {
            return res.status(404).json({ message: 'No user found with this student ID' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error finding user", error: error.message });
    }
});

// Find student by user ID
app.get('/findstudentuserid/:userID', async (req, res) => {
    const userID = req.params.userID;
    
    try {
        const student = await Student.findOne({ idNumber: userID });
        
        if (!student) {
            return res.status(404).json({ message: 'No student found with this user ID' });
        }
        
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Error finding student", error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});