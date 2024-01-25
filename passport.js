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
  Users.findOne({ Name: name })
    .then((user) => {
      if (!user) {
        console.log('incorrect name');
        return callback(null, false, { message: 'Incorrect name.' });
      }

      // Verify the password
      if (!user.validatePassword(password)) {
        console.log('incorrect password');
        return callback(null, false, { message: 'Incorrect password.' });
      }
      console.log('finished');
      return callback(null, user);
    })
    .catch((error) => {
      console.log(error);
      return callback(error);
    });
}));

/**
 * Passport JWT Strategy for authenticating users with a JSON Web Token.
 * @description This strategy is used for securing the API endpoints and validating the JWT in requests.
 */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret' // Replace 'your_jwt_secret' with your actual secret key
}, (jwtPayload, callback) => {

  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));
