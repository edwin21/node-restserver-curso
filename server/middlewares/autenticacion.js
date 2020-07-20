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


module.exports = {
    verificaToken,
    verificaAdmin_Role
};