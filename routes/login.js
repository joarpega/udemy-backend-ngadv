var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {


    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear token
        usuarioBD.password = 'd^.^b'
            //          jwt.sign( payload data que quiero poner en el token , seed: cadena que tenemos que definir de forma unica , fecha de expiracion (tiempo) )
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });



        res.status(200).json({
            ok: true,
            mensaje: 'Login correcto',
            usuario: usuarioBD,
            token: token,
            id: usuarioBD.id
        });

    });


});




module.exports = app;