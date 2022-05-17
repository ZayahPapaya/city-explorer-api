'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { nextTick } = require('process');
app.use(cors());
const PORT = process.env.PORT;

app.get('/', (request, response) => {
  response.send('pog.com');
});

app.get('/weather', (req, res, next) => {
  try {
    const city = req.query.type;
    const queryResults = new Forecast(city);
    res.status(200).send(queryResults);
  } catch (error) {
    error.customMessage = `Something's wrong with your API call`;
    console.log(error.customMessage + error);
    next(error)
  }
});

class Forecast {
  static weatherChannel = require('./data/weather.json');
  constructor(city) {
    this.weatherData = Forecast.weatherChannel.find(value => value.city_name.toLowerCase() === city.toLowerCase());
    this.weatherReport = this.weatherData.data.map(value => ({ 'date': value.datetime, 'description': value.weather.description }));
  }
}



app.use((error, request, response, next) =>{
  response.status(500).send(`Service failure: ${error.customMessage}`);
});
app.listen(PORT, () => console.log(`listening on ${PORT}`));