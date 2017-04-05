const express = require('express');
const bodyParser = require('body-parser');

var User = require('./user');
// var view = require('./view');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log(req.url);
  next();
});

app.get('/users', function (req, res) {
  res.send(User.find());
});

app.get('/users/:id', function (req, res) {
  var id = parseInt(req.params.id, 10);
  var user = User.findById(id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ error: 'User not found' });
  }
});

app.post('/users', function (req, res) {
  res.send(req.body);
});

app.listen(3000, function () {
  console.log('Server up at port 3000');
});
