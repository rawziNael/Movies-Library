"use strict";

const express = require('express');
const cors = require('cors');

const axios = require('axios');
const pg = require('pg');
const req = require('express/lib/request');
const res = require('express/lib/response');
const movie = require('./data.json');

require('dotenv').config();
const PORT = process.env.PORT;

const server = express();
server.use(cors());
server.use(express.json());

//Task 11
server.get('/', Home);
server.get('/favorite', Favorite);

//Task12
server.get('/trending', GetTranding);
server.get('/search', GetSearch);

//Task13
server.post('/addMovie', addBestMov);
server.get('/getMovies', getBestMov);

//Task14
server.put('/update/:id', updateMovie);
server.delete('/delete/:id', deleteMovie);
server.get('/getMovie/:id', getYourMovie);

//error handler
server.get('*', pageError);
server.get(errorFix);

// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
//sadfsaf
function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

// function Home(request, response) {
//     let obj = new Movie(movie.title, movie.poster_path, movie.overview);
//     response.status(200).send(obj);
// }

//=========================================Task11===================================================

function Home(request, response) {
    response.status(200).send("This is a home page");
}

function Favorite(request, response) {
    response.status(200).send("Welcome to Favorite Page");
}

//=========================================task12=====================================================

function GetTranding(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
    console.log(url);
    axios.get(url).then((result) => {
        console.log(result.data);
        let trendy = result.data.results.map(film => {
            return new Movie(film.id, film.title, film.release_date, film.poster_path, film.overview);
        })
        res.status(200).send(trendy);
    }).catch(error => {
        errorFix(error, req, res)
    })
}

function GetSearch(req, res) {
    let query = "Eternals";
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${query}`;
    axios.get(url).then((result) => {
        let search = result.data.results.map(film => {
            return new Movie(film.id, film.title, film.release_date, film.poster_path, film.overview);
        })
        res.status(200).send(search);
    }).catch(error => {
        errorFix(error, req, res)
    })
}


//==================================== Task13 ===============================================

function addBestMov(req, res) {
    const mov = req.body;
    let sql = `INSERT INTO bestMovie(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let valArr = [mov.title, mov.release_date, mov.poster_path, mov.overview];
    client.query(sql, valArr).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorFix(error, req, res)
    });
}

function getBestMov(req, res) {
    let sql = `SELECT * FROM bestMovie;`
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorFix(error, req, res)
    });
}


//======================================Task14==================================================


function updateMovie(req, res) {
    const id = req.params.id;
    const movie = req.body;
    const sql = `UPDATE bestMovie SET title = $1, release_date = $2, poster_path = $3, overview = $4 WHERE id = $5 RETURNING *;`;
    let movies = [movie.title, movie.release_date, movie.poster_path, movie.overview, id];
    client.query(sql, movies).then(data => {
        res.status(200).json(data.rows)
    }).catch(error => {
        errorFix(error, req, res)
    });
}

function deleteMovie(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM bestMovie WHERE id=${id};`
    client.query(sql).then(() => {
        res.status(200).json("The movie has been deleted");
    }).catch(error => {
        errorHandler(error, req, res)
    });
}

function getYourMovie(req, res) {
    let id = req.params.id
    let sql = `SELECT * FROM bestMovie WHERE id=${id};`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}

//======================================errors & connect=========================================

function errorFix(error, res, req) {
    res.status(500).json(error);
}

function pageError(request, response) {
    response.status(404).send("page not found error");
}

client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)
    })
})
