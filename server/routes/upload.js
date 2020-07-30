const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    }


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

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    console.log(extension);
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //Cambiamos el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo == 'usuarios') {
            guardarImagenUsuario(id, res, nombreArchivo);
        } else {
            guardarImagenProducto(id, res, nombreArchivo);

        }

        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });
    });
});

function guardarImagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            BorrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {

            BorrarImagen(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto NO encontrado'
                }
            })
        }



        //BORRAMOS LA IMAGEN ANTERIOR.
        BorrarImagen(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {


            return res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })



    });

}

function guardarImagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            BorrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {

            BorrarImagen(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario NO encontrado'
                }
            })
        }



        //BORRAMOS LA IMAGEN ANTERIOR.
        BorrarImagen(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {


            return res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })



    });

}

function BorrarImagen(nombreArchivo, tipo) {
    let pathImgen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImgen)) {
        fs.unlinkSync(pathImgen);

    }

}

module.exports = app;