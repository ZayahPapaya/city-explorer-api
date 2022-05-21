'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
app.use(cors());
const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('Working');
});

app.get('/weather', async (req, res, next) => {
  try {
    console.log('getting weather');
    const { lat, lon } = req.query;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_KEY}&lang=en&units=I&lat=${lat}&lon=${lon}&days=3`;
    const response = await axios.get(url);
    const queryResults = response.data.data.map(day => new Forecast(day));
    res.status(200).send(queryResults);
  } catch (error) {
    error.customMessage = 'API fail from weather.';
    next(error);
  }
});

app.get('/movie', async (req, res, next) => {
  try {
    console.log('getting movie');
    let search = req.query.search;
    search = search.split(',')[0];
    console.log(search);
    const response = await axios.get(`${process.env.MOVIE_SERVER}?api_key=${process.env.MOVIE_KEY}&query=${search}`);
    console.log(response.data);
    const queryResults = response.data.results.map(movie => new Movie(movie));
    res.status(200).send(queryResults);
  } catch (error) {
    error.customMessage = 'API fail from movie.';
    next(error);
  }
});

class Forecast {
  constructor(day) {
    this.datetime = day.datetime;
    this.description = day.weather.description;
  };
};

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.description = movie.overview;
    this.poster = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    this.avgVotes = movie.vote_average;
    this.totalVotes = movie.vote_count;
    this.popularity = movie.popularity;
    this.release = movie.release_date;
  };
};



app.use((error, request, response, next) => {
  response.status(500).send(`Service failure: ${error.customMessage}`);
});
app.listen(PORT, () => console.log(`listening on ${PORT}`));