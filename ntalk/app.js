var express = require('express');
var routes = require('./routes/index');
users = require('./routes/users');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use('/', routes);
app.use('/users', users);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});