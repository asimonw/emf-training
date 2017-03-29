const express = require('express');

var User = require('./user');
// var view = require('./view');

var app = express();

app.get('/users', function (req, res) {
  res.send(User.find());
});

app.get('/users/:id', function (req, res) {
  var id = req.params.id;
  res.send('Hi ' + id);
});

app.listen(3000, function () {
  console.log('Server up at port 3000');
});
