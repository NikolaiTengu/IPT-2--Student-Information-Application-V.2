const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        userID: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName: { type: String },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        userType: { type: String, required: true }
    },
    { collection: 'user-data'}
);

module.exports = mongoose.model('User', User);