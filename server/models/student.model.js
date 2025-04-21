const mongoose = require('mongoose');

const Student = new mongoose.Schema(
    {
        id: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    { collection: 'students-data'}
);