const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

let students = []

//functions to add, update, delete and fetch students

app.get("/fetchstudents", (req, res) => {
  res.json(students);
});

app.post("/addstudent", (req, res) => {
    const newStudent = req.body;
    students.push(newStudent);
    res.status(201).json(newStudent);
    console.log(newStudent);
    });

app.put('/updatestudent/:id', (req, res) => {
        const id = req.params.id;
        const updatedStudent = req.body;
        res.status(200).json({ message: 'Student updated successfully' });
        console.log(updatedStudent);
    });

app.get('/user/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Welcome, ${name}!`);
    });

app.delete('/deletestudent/:id', (req, res) => {
    const id = req.params.id;
    
    
    const studentIndex = students.findIndex(student => String(student.id) === String(id));
    
    if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student not found' });
    }
    
   
    const deletedStudent = students.splice(studentIndex, 1)[0];
    
    res.status(200).json({ 
        message: 'Student deleted successfully',
        deletedStudent 
    });
    
    console.log(`Deleted student with id: ${id}`);
});

const port = 1337;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
