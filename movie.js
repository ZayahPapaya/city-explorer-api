const axios = require('axios');

function getMovie(request, response) {
  console.log('getting movie');
  let search = request.query.search.split(',')[0];
  console.log(search);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_KEY}&query=${search}`;
  axios.get(url)
    .then(res => {
      const queryResults = res.data.results.map(movie => new Movie(movie));
      response.status(200).send(queryResults)
    })
    .catch(error => {
      response.status(500).send(`Server error in getMovie: ${error}`)
    });
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