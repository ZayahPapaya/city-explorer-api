const axios = require('axios');
let cache = require('./cache.js');

function getWeather(request, response) {
  const incomingLat = request.query.lat;
  const incomingLon = request.query.lon;
  const key = 'my-key:' + incomingLat + incomingLon;
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
    return cache[key].data;
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_KEY}&lang=en&units=I&lat=${incomingLat}&lon=${incomingLon}&days=3`)
      .then(res => {
        const weatherArr = res.data.data.map(day => new Forecast(day));
        cache[key].data = weatherArr;
        response.status(200).send(weatherArr)
      }).catch(error => response.status(500).send(`Server error in getWeather: ${error}`))
  };
}
class Forecast {
  constructor(day) {
    this.datetime = day.datetime;
    this.description = day.weather.description;
  };
};

module.exports = getWeather;