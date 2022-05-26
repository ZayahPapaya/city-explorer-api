'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 3002;
const getWeather = require('./weather');
const notFound = require('./notFound')
const getMovie = require('./movie');
const cache = require ('./cache')
app.get('/', (request, response) => { response.send('Working')});
app.get('/weather', getWeather);
app.get('/movie', getMovie);
app.use('*', notFound);
app.listen(PORT, () => console.log(`listening on ${PORT}`));