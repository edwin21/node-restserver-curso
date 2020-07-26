const express = require('express');

const _ = require('underscore');


const Produto = require('../models/producto');
const Categoria = require('../models/categoria');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const { json } = require('body-parser');


const app = express();


//GET: Obtiene una lista de productos, recibe desde y limite
app.get('/producto', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    let filtro = {};
    Produto.find(filtro)
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos,
                cuantos: productos.length
            })
        });
});

//GET: Obtiene un producto en especifico, en base a su ID
app.get('/producto/:id', (req, res) => {


    let filtro = { _id: req.params.id };
    Produto.find(filtro)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            })
        });
});

//GET: Obtiene un producto en especifico, en base a su ID
app.get('/producto/buscar/:termino', (req, res) => {


    let regex = new RegExp(req.params.termino, 'i');
    console.log(regex);

    let filtro = { nombre: regex };
    Produto.find(filtro)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            })
        });
});



//POST: Crea un nuevo registro de producto
app.post('/producto', [verificaToken], (req, res) => {

    let body = req.body;
    console.log(req.body);
    Categoria.findById(body.categoria, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria No existe'
                }
            })
        }


        let producto = new Produto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            categoria: categoriaDB._id,
            usuario: req.usuario._id

        })

        producto.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
    });
});



//PUT: Crea un nuevo registro de producto
app.put('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    //let body = _.pick(req.body);
    // let camposParaActualizar = {
    //     nombre: req.body.nombre,
    //     precioUni: req.body.precioUni,
    //     descripcion: req.body.descripcion,
    //     categoria: req.body.categoria

    // };

    Produto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err

            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });



    });
});

//DELETE: Elimina el registro producto
app.delete('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;

    Produto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            message: 'Producto eliminado'
        });
    });

});

module.exports = app;