const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const UserModel = require('./model/model');

const router = express.Router();
mongoose.connect('mongodb://user01:D%40uheo1001@ds135704.mlab.com:35704/auth_jwt_customer', {
    useNewUrlParser: true,
    useCreateIndex: true,
});
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

require('./auth/auth');

app.use(bodyParser.urlencoded({ extended : false }) );

const routes = require('./routes/routes');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/', routes);

app.listen(3000, () => {
    console.log('Server started')
});