const express = require('express');
const autenticacion = require(__dirname + '/../utils/auth');
let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();
const multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})
let upload = multer({ storage: storage });


//Servicio de listado general
router.get('/', autenticacion, (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', { productos: resultado });
    }).catch(error => {
        res.render('admin_error');
    });
});

//Servicio de renderización de vista de formulario de inserción
router.get('/productos/nuevo', autenticacion, (req, res) => {
    res.render('admin_productos_form');
});

//Servicio de renderización de vista de modificación de producto
router.get('/productos/editar/:id', autenticacion, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('admin_productos_form', { producto: resultado });
    }).catch((error = 'Producto no encontrado') => {
        res.render('admin_error', { error: error });
    });
});

//Servicio de inserción de producto
router.post('/productos', upload.single('imagen'), (req, res) => {
    let comentario = {
        nombreUsuario: req.session.usuario,
        comentario: req.body.comentario,
    }
    let nuevoProducto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        imagen: req.file.filename,
        comentarios: comentario
    });

    nuevoProducto.save().then(resultado => {
        if (resultado)
            res.redirect('/');
    }).catch(error => {
        res.render('admin_error', { error: error });
    });
});

//Servicio de modificación de producto
router.post('/productos/:id', upload.single('imagen'), (req, res) => {
    Producto.findByIdAndUpdate(req.params.id, {
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        imagen: req.file.filename
    }, { new: true }).then(resultado => {
        if (resultado)
            res.redirect('/');
    }).catch(error => {
        res.render('admin_error', { error: error });
    });
});

//Servicio de modificacion de comentarios
router.post('/comentarios/:idProducto', autenticacion, (req, res) => {
    let comentario = {
        nombreUsuario: req.session.usuario,
        comentario: req.body.comentario
    };

    Producto.findByIdAndUpdate(req.params.idProducto, { $addToSet: {comentarios:  comentario } }, { new: true }).then(resultado => {
        if (resultado)
            res.redirect('/');
    }).catch(error => {
        res.render('admin_error', { error: '' })
    });
});

//Servicio de eliminación de producto
router.delete('/productos/:id', (req, res) => {
    Producto.findByIdAndRemove(req.params.id)
        .then(resultado => {
            if (resultado)
                res.redirect('/');
        }).catch(error => {
            res.render('admin_error');
        });
});

//Servicio de eliminacion de comentario
router.delete('/comentarios/:idProducto/:idComentario', (req, res) => {
    let id_comentario = req.params.idComentario;
    let id_producto = req.params.idProducto;

    Producto.findOneAndUpdate({ _id: id_producto }, { $pull: { comentarios: { _id: id_comentario } } }, { new: true })
        .then(resultado => {
            if (resultado)
                res.redirect('/');
        }).catch(error => {
            res.render('admin_error');
        });
});

module.exports = router;