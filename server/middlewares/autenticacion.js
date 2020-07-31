const jwt = require('jsonwebtoken');


//===============
//Verificar Token
//===============
let verificaToken = (req, res, next) => {

    let token = req.get('token'); // Authorization: Este es el mas comun.

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();


    });
    // res.json({
    //     token: token
    // });



};


//===============
//Verificar AdminRole
//===============
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario);
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();

};


//===============
//Verificar Token en imagen
//===============
let verificaTokenImagen = (req, res, next) => {
    console.log('Entra a verifica token imagen');
    let token = req.query.token; // Authorization: Este es el mas comun.
    console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido1'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImagen
};