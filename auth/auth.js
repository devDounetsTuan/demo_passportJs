const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');
const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//tao passport trung gian de xu li regis
passport.use('signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            //Save the information provided by the user to the the database
            const user = await UserModel.create({
                email,
                password
            });
            //Send the user infomation to the next middleware
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }

));

//tao passport trung gian de xu li login
passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            //tim kiem user khop voi email
            const user = await UserModel.findOne({
                email
            });
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });

            }
            //Kiem tra password va chac rang no khop voi ham bam luu tru tren co so du lieu
            //neu password khop thi tra ve true
            const validate = await user.isValidPassword(password);
            if (!validate) {
                return done(null, false, {
                    message: 'Wrong Password'
                });

            }
            return done(null, user, {
                message: 'Logged in Successfully'
            });
        } catch (error) {
            return done(error);
        }
    }));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
    //secret we used to sign our JWT
    secretOrKey: 'top_secret',
    //we expect the user to send the token as a query paramater with the name 'secret_token'
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));