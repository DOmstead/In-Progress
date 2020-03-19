require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movieList = require('./movies-data.json');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'Tiny' : 'dev';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

//Security token established. 
app.use(function validateSecurity(req,res,next){
  const securityToken = process.env.API_TOKEN;
  const reqToken = req.get('Authorization');

  if (!reqToken || reqToken !== securityToken.split(' ')[1]){
    return res.status(401).json({error: 'Unauthorized: Please Use a Valid Security Token'});  
  }
  next();
});

//Below are the GET handler functions

function handleGenre(genre,responseArray){

  return responseArray.filter( movie => 
    movie.genre.toLowerCase().includes(genre.toLowerCase())
  );
}

function handleCountry(country,responseArray){
  return responseArray.filter( movie => 
    movie.country.toLowerCase().includes(country.toLowerCase())
  );
}

function handleVote(vote, responseArray){
  return responseArray.filter( movie =>
    movie.avg_vote >= Number(vote)
  );
}

//Below establishes the valid endpoint

app.get('/movie', function handleGetMovies(req,res) {
  let genre = req.query.genre;
  let country = req.query.country;
  let vote = req.query.avg_vote; 
  let responseArray = movieList;
  
  if(genre){
    responseArray = handleGenre(genre,movieList);
  }
  if(country){
    responseArray = handleCountry(country,responseArray);
  }
  if(vote){
    responseArray = handleVote(vote,responseArray);
  }
  res.send(responseArray);
});


//Below readys the server to listen for requests and handles errors.

app.use((error,req,res,next) => {
  let response;
  if(process.env.NODE_ENV === 'production'){
    response = {error:{message:'server error'}};
  } else {
    response = {error};
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT,() => {
  console.log(`Moviedex listening on Port ${PORT}`);
});

