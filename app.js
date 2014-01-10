
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('env', 'development');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'));

io.sockets.on('connection', function (socket) {
  socket.on('move', function(msg){
     socket.emit('move',msg);
     socket.broadcast.emit('move',msg);
  });
  socket.on('color', function(msg){
     socket.emit('color',msg);
     socket.broadcast.emit('color',msg);
  });
  socket.on('start', function(msg){
     socket.emit('start',msg);
     socket.broadcast.emit('start',msg);
  });
  socket.on('close', function(msg){
     socket.emit('close',msg);
     socket.broadcast.emit('close',msg);
  });
  socket.on('clear', function(msg){
     socket.emit('clear',msg);
     socket.broadcast.emit('clear',msg);
  });
});
/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/
