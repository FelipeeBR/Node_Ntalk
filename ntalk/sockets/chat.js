module.exports = function(io) {
    var crypto = require('crypto');
    var sockets = io.sockets;
    sockets.on('connection', function(client) {
        var session = client.handshake.session;
        var usuario = session.usuario;
        client.on('send-server', function(msg) {
            console.log('Mensagem recebida:', msg);
            var sala = session.sala;
            var data = {email: usuario.email, sala: sala}
            msg = "<b>"+ usuario.nome +":</b> "+ msg +"<br>";
            client.broadcast.to(sala).emit('new-message', data);
            sockets.in(sala).emit('send-client', msg);
        });

        client.on('join', function(sala) {
            console.log('Cliente entrou na sala:', sala);
            session.sala = sala;
            client.join(sala);
        });

        client.on('disconnect', function() {
            client.leave(session.sala);
        });
    });
};