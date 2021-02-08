const express = require('express');

let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

//Servicio de listado
router.get('/', (req, res) => {
    res.render('publico_index');
});

//Servicio de listado por texto
router.post('/buscar', (req, res) => {
    let arrayProductos = [];
    let variableSearch = req.body.busqueda;

    Producto.find().then(resultado => {
        if (resultado) {
            arrayProductos = resultado.filter(p => (p.nombre.toLowerCase()).includes(variableSearch.toLowerCase()));
            if (arrayProductos.length > 0){
                res.render('publico_index', { productos: arrayProductos });
            }
            else if(variableSearch == undefined  ){
                res.render('publico_index', { productos: resultado});
            }
            else if(arrayProductos.length == 0){
                res.render('publico_index', { error: '¡No hay productos con ese nombre!'});
            }
        }
        else{
            res.render('publico_error', {error: 'No hay productos encontrados'});
        }
    }).catch((error) => {
        res.render('publico_error', { error: error });
    });;
});

//Servicio de listado por id
router.get('/producto/:id', (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('publico_producto', { producto: resultado });
    }).catch((error = 'Producto no encontrado') => {
        res.render('publico_error', { error: error });
    });
});

module.exports = router;