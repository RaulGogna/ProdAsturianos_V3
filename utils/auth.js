// Middleware que se aplicará para autenticar usuarios en rutas protegidas
let autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario){
        return next();
    }
    else
        res.render('login');
};

module.exports = autenticacion;