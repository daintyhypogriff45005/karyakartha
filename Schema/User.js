const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
});

const User = mongoose.model('User', Userschema);
User.createIndexes();
module.exports = User;