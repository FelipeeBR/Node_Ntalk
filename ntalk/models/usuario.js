const { default: mongoose } = require('mongoose');

module.exports = function(app) {
    var Schema = require('mongoose').Schema;
    var contato = Schema({
        nome: String,
        email: String
    });
    var usuario = Schema({
        nome: {type: String, required: true},
        email: {type: String, required: true},
        contatos: [contato]
    });
    return mongoose.model('usuarios', usuario);
}