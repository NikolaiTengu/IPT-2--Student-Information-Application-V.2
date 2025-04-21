const mongoose = require('mongoose');

const Student = new mongoose.Schema(
    {
        id: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName: { type: String},
        course: { type: String, required: true },
        year: { type: String, required: true },
    },
    { collection: 'student-data'}
);