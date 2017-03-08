const http = require('http');

var user = require('./user');
var view = require('./view');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (req.url === '/') {
    res.write('<h1>Hello node</h1>');
    res.end(view(user));
  } else if (req.url === '/about') {
    res.write('<h1>About</h1>');
    res.end();
  }
});

server.listen(3000, function () {
  console.log('Server up at port 3000');
});
