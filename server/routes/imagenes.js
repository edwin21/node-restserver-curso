const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImagen, verificaToken } = require('../middlewares/autenticacion');

const app = express();




app.get('/imagen/:tipo/:imagen', verificaTokenImagen, (req, res) => {

    //console.log(req.query.token);
    let tipo = req.params.tipo;
    let imagen = req.params.imagen;

    //Validar TIPO
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')

            }
        })
    }

    let noImage = path.resolve(__dirname, '../assets/no-image.jpg');
    let pathFoto = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    if (fs.existsSync(pathFoto)) {
        res.sendFile(pathFoto);
    } else {
        res.sendFile(noImage);
    }
    //console.log(noImage);


});

module.exports = app;