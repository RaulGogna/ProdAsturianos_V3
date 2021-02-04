const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

Usuario.collection.drop();

let usu1 = new Usuario({
    login: 'maycalle',
    password: bcrypt.hashSync('1234', 10)
});
usu1.save();

let usu2 = new Usuario({
    login: 'nacho',
    password: bcrypt.hashSync('1234', 10)
});
usu2.save();
