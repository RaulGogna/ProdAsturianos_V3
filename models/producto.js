const mongoose = require('mongoose');

let comentarioSchema = new mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: true,
        trim: true
    },
    comentario: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    }
});

let productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 1
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    imagen:{
        type: String,
        required: false
    },
    comentarios: [comentarioSchema]
});

let Producto = mongoose.model('producto', productSchema);

module.exports = Producto;