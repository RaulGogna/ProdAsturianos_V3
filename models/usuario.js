const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    }
});

let Usuario = mongoose.model('usuario', userSchema);

module.exports = Usuario;