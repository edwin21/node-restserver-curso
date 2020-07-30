const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();




app.get('/imagen/:tipo/:imagen', (req, res) => {

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

    let pathFoto = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    console.log(pathFoto);
    res.sendFile(pathFoto);

    // console.log(__dirname);
    // let noImage = path.resolve(__dirname, '../assets/no-image.jpg');
    // res.sendFile(noImage);
});

module.exports = app;