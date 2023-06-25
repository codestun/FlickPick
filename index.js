const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

let topMovies = [
  // Array of movie objects
  {
    title: 'Stop Making Sense',
    director: 'Jonathan Demme',
    year: 1984
  },
  {
    title: 'Woodstock',
    director: 'Michael Wadleigh',
    year: 1970
  },
  {
    title: 'The Last Waltz',
    director: 'Martin Scorsese',
    year: 1978
  },
  {
    title: 'Gimme Shelter',
    director: 'Albert Maysles and David Maysles',
    year: 1970
  },
  {
    title: 'Shine a Light',
    director: 'Martin Scorsese',
    year: 2008
  },
  {
    title: 'Monterey Pop',
    director: 'D.A. Pennebaker',
    year: 1968
  },
  {
    title: 'Pink Floyd: The Wall',
    director: 'Alan Parker',
    year: 1982
  },
  {
    title: 'U2 3D',
    director: 'Catherine Owens and Mark Pellington',
    year: 2007
  },
  {
    title: 'Festival Express',
    director: 'Bob Smeaton',
    year: 2003
  },
  {
    title: 'The Song Remains the Same',
    director: 'Peter Clifton and Joe Massot',
    year: 1976
  }
];

// Set up Morgan middleware to log all requests
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('Welcome to FlickPick!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use(express.static('public'));

app.get('/documentation.html', (req, res) => {
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
