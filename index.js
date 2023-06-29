const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');

app.use(bodyParser.json());

// Use in-memory array for users
let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: ["The Last Waltz"]
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: []
  },
];

// Use in-memory array for movies
let movies = [
  {
    title: "The Last Waltz",
    description: "A legendary farewell concert by The Band featuring various guest artists.",
    year: 1978,
    genre: {
      name: "Rock, Documentary",
      description: "Combines elements of rock music and documentary filmmaking to capture the essence of the concert."
    },
    director: {
      name: "Martin Scorsese"
    },
    imageURL: ""
  },
  {
    title: "Stop Making Sense",
    description: "An iconic live performance by Talking Heads, known for its innovative staging and energetic performances.",
    year: 1984,
    genre: {
      name: "Rock, New Wave",
      description: "Blends the rock genre with elements of punk, art, and pop music, characterized by its unique style and energy."
    },
    director: {
      name: "Jonathan Demme"
    },
    imageURL: ""
  },
  {
    title: "Woodstock",
    description: "The famous music festival held in 1969, capturing the spirit of the counterculture movement.",
    year: 1970,
    genre: {
      name: "Documentary, Music",
      description: "Combines the documentary format with live music performances, providing a comprehensive experience of the festival."
    },
    director: {
      name: "Michael Wadleigh"
    },
    imageURL: ""
  },
  {
    title: "Pulse",
    description: "Pink Floyd's stunning concert in London featuring their classic hits and elaborate stage effects.",
    year: 1995,
    genre: {
      name: "Progressive Rock",
      description: "Pushes the boundaries of rock music by incorporating complex musical structures and conceptual themes."
    },
    director: "David Mallet",
    imageURL: ""
  },
  {
    title: "Monterey Pop",
    description: "A groundbreaking documentary capturing the performances at the 1967 Monterey Pop Festival, including Jimi Hendrix, Janis Joplin, and The Who.",
    year: 1968,
    genre: {
      name: "Documentary, Music",
      description: "Provides an immersive experience of the historic music festival, showcasing iconic performances and cultural moments."
    },
    director: {
      name: "D.A. Pennebaker"
    },
    imageURL: ""
  },
  {
    title: "Shine a Light",
    description: "Martin Scorsese directs this concert film featuring The Rolling Stones performing live in New York City.",
    year: 2008,
    genre: {
      name: "Rock, Documentary",
      description: "Offers a glimpse into the rock 'n' roll world through the electrifying performances of The Rolling Stones."
    },
    director: {
      name: "Martin Scorsese",
    },
    imageURL: ""
  },
  {
    title: "Gimme Shelter",
    description: "A documentary that chronicles The Rolling Stones' 1969 American tour, culminating in the infamous Altamont Free Concert.",
    year: 1970,
    genre: {
      name: "Documentary, Music",
      description: "Explores the intersection of music and social unrest, capturing a pivotal moment in rock history."
    },
    director: {
      name: "Albert and David Maysles"
    },
    imageURL: ""
  },
  {
    title: "Live at Pompeii",
    description: "Pink Floyd's iconic concert film, capturing their performances in an ancient Roman amphitheater in Pompeii.",
    year: 1972,
    genre: {
      name: "Progressive Rock",
      description: "Showcases Pink Floyd's progressive rock soundscapes and mesmerizing visuals, set against the backdrop of Pompeii's historic ruins."
    },
    director: {
      name: "Adrian Maben"
    },
    imageURL: ""
  },
  {
    title: "The Song Remains the Same",
    description: "Led Zeppelin's concert film featuring footage from their 1973 performances at Madison Square Garden in New York City.",
    year: 1976,
    genre: {
      name: "Rock",
      description: "Presents Led Zeppelin's energetic live performances, capturing the essence of their iconic rock music."
    },
    director: {
      name: "Peter Clifton, Joe Massot"
    },
    imageURL: ""
  },
  {
    title: "Rattle and Hum",
    description: "U2's exploration of American music and culture during their 1987 Joshua Tree Tour, featuring live performances and documentary segments.",
    year: 1988,
    genre: {
      name: "Rock, Documentary",
      description: "Blends U2's passionate rock music with insightful glimpses into American history and society."
    },
    director: {
      name: "Phil Joanou"
    },
    imageURL: ""
  }
];

// CREATE - Allow new users to register
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('Users need names');
  }
});

// UPDATE - Allow users to update their user info (username)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('There is no such user');
  }
});

// CREATE - Allow users to add a movie to their list of favorites
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('There is no such user');
  }
});

// DELETE - Allows users to delete a movie from their favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('There is no such user');
  }
});

// DELETE - Allow existing users to deregister
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send('There is no such user');
  }
});

// READ - Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ - Return data (description, genre, director) about a single movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('There is no such movie');
  }
});

// READ - Return data about a genre (description) by name/title (e.g., "Rock, Documentary")
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.genre.name && movie.genre.name === genreName)?.genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('There is no such genre');
  }
});

// READ - Return data about a director by name
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name && movie.director.name === directorName)?.director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('There is no such director');
  }
});

// Set up Morgan middleware to log all requests
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('Welcome to FlickPick!');
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  // Log the error to the terminal
  console.error(err);

  // Send an error response to the client
  res.status(500).send('Internal Server Error');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
