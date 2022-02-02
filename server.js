"use strict";

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { response } = require('express');
require('dotenv').config();

// const PORT = process.env.PORT;
// const info = require('./data.json');




const server = express();
server.use(cors());

server.get('/', Home);
server.get('/favorite', Favorite);
server.get('/trending', GetTranding);
server.get('/search' , GetSearch);
server.get('*', InCase);
server.get(errorFix);



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
        console.log(err);
    })
}

function GetSearch(req, res) {
    let query = "Eternals";
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query${query}`;
    axios.get(url).then((result) => {
        let search = result.data.results.map(film => {
            return new Movie(film.title);
        })
        res.status(200).send(search);
    }).catch((err) => {

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


server.listen(3000, () => {
    console.log("You'r now listening to port");
})