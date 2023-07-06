const mongoose = require('mongoose');

// Define the movie schema
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

// Define the user schema
let userSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Create the Movie model using the movie schema
let Movie = mongoose.model('Movie', movieSchema);

// Create the User model using the user schema
let User = mongoose.model('User', userSchema);

// Export the Movie and User models
module.exports.Movie = Movie;
module.exports.User = User;
