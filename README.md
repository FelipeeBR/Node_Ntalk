# Ntalk 

### Este projeto acompanha os estudos de **"Node.js"** para a construção de aplicação com Express, MongoDB e Socket.IO.

#### Um sistema de chat em tempo real utilizando o Socket.IO no backend. Ele permite que múltiplos usuários se conectem, entrem em salas, enviem mensagens e sejam notificados sobre quem está online ou offline.
---
## 🛠️ Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
---
## 🚀 Funcionalidades
- Cadastro e Autenticação de Usuarios
- Cadastro de Contatos
- Chat em tempo real com contatos
- Gerenciamento de conexões em tempo real.
- Notificação de usuários online e offline.
- Sistema de salas para segmentar conversas.
- Envio e broadcast de mensagens entre clientes conectados.
---
## 🧠 Funcionamento do Código
```
sockets.on('connection', function(client) {
    var session = client.handshake.session;
    var usuario = session.usuario;
    onlines[usuario.email] = usuario.email;

```
- Quando um cliente se conecta, o servidor acessa a sessão do usuário.
- O usuário é adicionado à lista de online com base em seu e-mail.
---

```
  for(var email in onlines) {
      client.emit('notify-onlines', email);
      client.broadcast.emit('notify-onlines', email);
  }

```
- O servidor envia a lista de usuários online para o cliente conectado e a broadcast para os outros clientes.
---
```
  client.on('send-server', function(msg) {
      var sala = session.sala;
      var data = {email: usuario.email, sala: sala};
      msg = "<b>"+ usuario.nome +":</b> "+ msg +"<br>";
      client.broadcast.to(sala).emit('new-message', data);
      sockets.in(sala).emit('send-client', msg);
  });

```
- Quando o cliente envia uma mensagem, ela é emitida para todos os usuários da sala correspondente, com a formatação do nome do usuário e mensagem.
---
```
client.on('join', function(sala) {
    session.sala = sala;
    client.join(sala);
});
```
- Permite que um cliente entre em uma sala específica, usada para isolar conversas.
---
```
client.on('disconnect', function() {
    var sala = session.sala;
    var msg = "<b>" + usuario.nome + ":</b> saiu.<br>";
    client.broadcast.emit('notify-offlines', usuario.email);
    sockets.in(sala).emit('send-client', msg);
    delete onlines[usuario.email];
    client.leave(sala);
});
```
- Ao desconectar, o servidor:
- Notifica os outros clientes que o usuário ficou offline.
- Envia uma mensagem para a sala informando que o usuário saiu.
- Remove o usuário da lista de online.
