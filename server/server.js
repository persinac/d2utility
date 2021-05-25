const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
port = process.env.PORT || 48330;


// const mysql = require('mysql');
// // connection configurations
// const mc = mysql.createConnection({
//   host: 'localhost',
//   user: 'discord',
//   password: 'discord',
//   database: 'discord'
// });

// connect to database
// mc.connect();

app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/routes'); //importing route
routes(app); //register the route
