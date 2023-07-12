// Import necessary packages and libraries
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

// Assign relevant variables for convenience
let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// Local strategy for authenticating users with username and password
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {

  // Output the received username and password for debugging purposes
  console.log(username + '  ' + password);

  // Find a user in the database by username
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');

      // If user is not found or password is incorrect, return appropriate messages
      return callback(null, false, { message: 'Incorrect username or password.' });
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
