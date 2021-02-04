//Carga de librerias
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const nunjucks = require('nunjucks');
const session = require('express-session');
const methodOverride = require('method-override');

//Enrutadores
const auth = require(__dirname + '/routes/auth');
const publico = require(__dirname + '/routes/publico');
const producto = require(__dirname + '/routes/productos');


//Conectar con BD de Mongo
mongoose.connect(
    'mongodb://localhost:27017/ProdAsturianosV3',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    
require('./utils/generar_usuarios');
//Inicializar Express
let app = express();

app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})

// Configuramos motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

//Establecemos motor de plantillas
app.set('view engine', 'njk');

//Cargar middleware body-parser para peticiones POST y PUT
//Enrutadores
// Middleware para estilos Bootstrap
// Enrutadores para cada grupo de rutas
app.use(bodyparser.urlencoded());
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
app.use('/public', express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/', publico);
app.use('/admin', producto);
app.use('/auth', auth);

//Puesta en marcha del servidor
app.listen(8080);