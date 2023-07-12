// Import necessary packages and libraries
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

// Assign relevant variables for convenience
let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// Local strategy for authenticating users with name and password
passport.use(new LocalStrategy({
  usernameField: 'Name',
  passwordField: 'Password'
}, (name, password, callback) => {

  // Output the received name and password for debugging purposes
  console.log(name + '  ' + password);

  // Find a user in the database by name
  Users.findOne({ Name: name }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect name');

      // If user is not found or password is incorrect, return appropriate messages
      return callback(null, false, { message: 'Incorrect name or password.' });
    }
    console.log('finished');
    return callback(null, user);
  });
}));

// JWT strategy for authenticating users with JSON Web Tokens (JWT)
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {

  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));
