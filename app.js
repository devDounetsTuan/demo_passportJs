const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const UserModel = require('./model/model');


mongoose.connect('mongodb://user01:D%40uheo1001@ds135704.mlab.com:35704/auth_jwt_customer', { useNewUrlParser: true ,useCreateIndex: true,});
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

require('./auth/auth');

app.use(bodyParser.urlencoded({ extended : false }) );
//ket noi den module routes
const routes = require('./routes/routes');
//const secureRoute = require('./routes/secure-routes');

app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
//app.use('/user', passport.authenticate('jwt', { session : false }), secureRoute );

//Handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error : err });
});

app.listen(3000, () => {
  console.log('Server started')
});