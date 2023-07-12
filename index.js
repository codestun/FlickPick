// Load necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

// Set up express and body-parser
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import "auth.js" file
let auth = require('./auth')(app);

// Require the Passport module and import the "passport.js" file
const passport = require('passport');
require('./passport');

// Set up Morgan for logging functionality
app.use(morgan('combined'));

// Connect to the database
mongoose.connect('mongodb://localhost:27017/fpDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Movies = Models.Movie;
const Users = Models.User;

/* ------ Routes for Movies -------- */
// Return JSON object containing data about all movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Return JSON object containing data about a single movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a genre (description) by name/title (e.g., "Rock")
app.get('/genres/:Name', (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Name })
    .then((movie) => {
      if(movie) {
        res.json(movie.Genre);
      } else {
        res.status(404).send('Genre ' + req.params.Name + ' not found.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a director by name
app.get('/directors/:Name', (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then((movie) => {
      if(movie) {
        res.json(movie.Director);
      } else {
        res.status(404).send('Director ' + req.params.Name + ' not found.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* ------ Routes for Users -------- */
// Return JSON object containing data about all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return JSON object containing data about a single user by name
app.get('/users/:Name', (req, res) => {
  Users.findOne({ Name: req.params.Name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow new users to register
app.post('/users', (req, res) => {
  Users.findOne({ Name: req.body.Name })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Name + ' already exists');
      } else {
        Users.create({
          Name: req.body.Name,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => { res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Allow users to update their user info
app.put('/users/:Name', (req, res) => {
  Users.findOneAndUpdate(
    { Name: req.params.Name },
    { $set:
      {
        Name: req.body.Name,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true })
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow users to add a movie to their list of favorites
app.post('/users/:Name/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Name: req.params.Name },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true })
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Name/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Name: req.params.Name },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }) // This line makes sure that the updated document is returned
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow existing users to deregister
app.delete('/users/:Name', (req, res) => {
  Users.findOneAndRemove({ Name: req.params.Name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Name + ' was not found');
      } else {
        res.status(200).send(req.params.Name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* ------ Other Routes -------- */
// Default text response
app.get('/', (req, res) => {
  res.send('Welcome to flickPick!');
});

// Documentation endpoint
app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  // Log error to the terminal
  console.error(err);

  // Send an error response to the client
  res.status(500).send('Internal Server Error');
});

// Listen for connections
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
