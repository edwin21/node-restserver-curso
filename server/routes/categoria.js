const express = require('express');

//Esta paquete sirve para obtener ciertos valores del body de la peticion '_PICK'
const _ = require('underscore');

//Importamos el modelo categoria para poder hacer objetos de este tipo

const Categoria = require('../models/categoria');

//Importamos los middleware. Utilizamos la destructuración, para acceder directamente a la funcion
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const usuario = require('../models/usuario');



//Instanciamos el paquete express
const app = express();

//GET: Obtener todas las categorias
app.get('/categoria', [verificaToken], (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    cuantos: conteo,
                    categorias
                });
            });


        });

});

//GET 2: Obtiene una sola categoria, recibe id de categoria
app.get('/categoria/:id', [verificaToken], (req, res) => {

    let idCategoria = req.params.id;
    Categoria.findOne({ '_id': idCategoria }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//POST: Crea un registro de categoria
app.post('/categoria', [verificaToken], (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


//PUT: Actualiza un registro de categoria
app.put('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;

    let camposParaActualizar = {
        descripcion: req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, camposParaActualizar, {
        new: true, //Regresa el campo de la db ACTULIZADO
        runValidators: true
    }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


//DELETE: Elimina un registro de categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            message: 'categoria borrada'
        });

    });

});


//Exportamos el modulo, para que se acceda a las funciones
module.exports = app;