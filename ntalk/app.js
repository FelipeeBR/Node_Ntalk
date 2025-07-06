const KEY = 'ntalk.sid', SECRET = 'ntalk';
var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var error = require('./middlewares/error');

var app = express();

var cookie = cookieParser(SECRET);
var store = new expressSession.MemoryStore();
var mongoose = require('mongoose');
global.db = mongoose.connect('mongodb+srv://felipemen74:Fkwvec67sc3jnvnN@cluster0.itdrono.mongodb.net/ntalk');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser(SECRET));
app.use(expressSession({secret: SECRET, name: KEY, store: store, resave: true, saveUninitialized: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.use(function(socket, next) {
  cookie(socket.request, {}, function(err) {
    if (err) return next(err);
    
    const sessionID = socket.request.signedCookies[KEY];
    if (!sessionID) return next(new Error('No session ID'));
    
    store.get(sessionID, function(err, session) {
      if (err || !session) return next(new Error('Session not found'));
      socket.handshake.session = session;
      next();
    });
  });
});

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

load('sockets')
  .into(io);

app.use(error.notFound);
app.use(error.serverError);

server.listen(3000, function() {
  console.log('App listening on port 3000!');
});