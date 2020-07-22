const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }

});

// Perosnalizamos el mensaje de campo unico
// categoriaSchema.plugin(uniqueValidator, {
//     message: '{PATH} debe de ser único'
// });


module.exports = mongoose.model('Categoria', categoriaSchema);