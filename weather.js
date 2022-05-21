const axios = require('axios');

function getWeather(request, response) {
  console.log('getting weather');
  const lat  = request.query.lat;
  const lon = request.query.lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_KEY}&lang=en&units=I&lat=${lat}&lon=${lon}&days=3`;
  axios
    .get(url)
    .then(res => {
      const queryResults = res.data.data.map(day => new Forecast(day));
      response.status(200).send(queryResults);
    })
    .catch(error => {
      response.status(500).send(`Server error in getWeather: ${error}`)
    });
}

class Forecast {
  constructor(day) {
    this.datetime = day.datetime;
    this.description = day.weather.description;
  };
};

module.exports = getWeather;