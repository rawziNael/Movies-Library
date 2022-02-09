"use strict";

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { response } = require('express');
require('dotenv').config();

const server = express();
server.use(cors());

server.get('/', Home);
server.get('/favorite', Favorite);
server.get('/trending', GetTranding);
server.get('/search' , GetSearch);
//two route
server.get('/discover_movie' , GetDisMov);
server.get('/discover_tv' , GetDisTV);

server.get('*', InCase);
server.get(errorFix);

const PORT = process.env.PORT;

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


function Home(request, response) {
    response.status(200).send("This is a home page");
}

function GetTranding(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
    console.log(url);
    axios.get(url).then((result) => {
        console.log(result.data);
        let trendy = result.data.results.map(film => {
            return new Movie(film.id, film.title, film.release_date, film.poster_path, film.overview);
        })
        res.status(200).send(trendy);
    }).catch((err) => {
        errorFix(error, res, req)
    })
}

function GetSearch(req, res) {
    let query = "Eternals";
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query${query}`;
    axios.get(url).then((result) => {
        let search = result.data.results.map(film => {
            return new Movie(film.id, film.title, film.release_date, film.poster_path, film.overview);
        })
        res.status(200).send(search);
    }).catch((err) => {
        errorFix(error, res, req)
    })
}

function GetDisMov(req, res) {
    let url = ` https://api.themoviedb.org/3/discover/movie?api_key=${process.env.APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
    axios.get(url).then((result) => {
        let discover = result.data.results.map(film => {
            return new Movie(film.id, film.title, film.release_date, film.poster_path, film.overview);
        })
        res.status(200).send(discover);
    }).catch((err) => {
        errorFix(error, res, req)
    })
}
function GetDisTV(req, res) {
    let url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.APIKEY}&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&include_null_first_air_dates=false&with_watch_monetization_types=flatrate&with_status=0&with_type=0`;
    axios.get(url).then((result) => {
        let tv = result.data.results.map(film => {
            return new Movie(film.id, film.title, film.release_date, film.poster_path, film.overview);
        })
        res.status(200).send(tv);
    }).catch((err) => {
        errorFix(error, res, req)
    })
}
function Favorite(request, response) {
    response.status(200).send("Welcome to Favorite Page");
}

function errorFix(error, res, req) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err);
}

function InCase(request, response) {
    response.status(404).send("We sorry, you chosed something not exist ");
}


server.listen(PORT, () => {
    console.log(`You'r now listening to ${PORT}`);
})