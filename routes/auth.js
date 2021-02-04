const express = require('express');
const bcrypt = require('bcrypt');

let Usuario = require(__dirname + '/../models/usuario.js');
let router = express.Router();

router.get('/login', (req, res) => {
    if (req.session.usuario)
        res.redirect('/admin');
    else
        res.render('auth_login');
});

router.post('/login', (req, res) => {
    let login = req.body.usuario;
    let password = req.body.password;

    Usuario.find().then(resultado => {
        let usuarioValido = resultado.filter(usuario => usuario.login == login && bcrypt.compareSync(password, usuario.password) == true);

        if (usuarioValido.length > 0) {
            req.session.usuario = usuarioValido[0].login;
            res.redirect('/admin');
        } else {
            res.render('auth_login', { error: 'Usuario o contraseña incorrectos' });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('auth_login');
});

module.exports = router;    