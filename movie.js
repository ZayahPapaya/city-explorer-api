const axios = require('axios');
let cache = require('./cache.js');

function getMovie(request, response) {
  const incoming = request.query.search.split(',')[0];
  const key = 'my-key:' + incoming;
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
    return cache[key].data; // key is request.query.search
  } else {
    console.log('Cache miss');
    cache[key] = {};// recipeArr is var storing the mapped class(s)
    cache[key].timestamp = Date.now();
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_KEY}&query=${incoming}`)
      .then(res => {
        const movieArr = res.data.results.map(movie => new Movie(movie))
        cache[key].data = movieArr;
        response.status(200).send(movieArr)
      }).catch(error => response.status(500).send(`Server error in getMovie: ${error}`))
  };
}

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

module.exports = getMovie;