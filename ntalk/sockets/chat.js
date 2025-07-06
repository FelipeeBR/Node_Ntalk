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
            client.broadcast.emit('new-message', data);
            sockets.in(sala).emit('send-client', msg);
        });

        client.on('join', function(sala) {
            if(!sala) {
                var timestamp = new Date().toString();
                var md5 = crypto.createHash('md5');
                sala = md5.update(timestamp).digest('hex');
            }
            console.log('Cliente entrou na sala:', sala);
            session.sala = sala;
            client.join(sala);
        });

        client.on('disconnect', function() {
            client.leave(session.sala);
        });
    });
};