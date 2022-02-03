"use strict";

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const req = require('express/lib/request');
const res = require('express/lib/response');
// const PORT = process.env.PORT;
// const info = require('./data.json');


require('dotenv').config();

const server = express();
server.use(cors());
server.use(express.json());

server.get('/', Home);
server.get('/favorite', Favorite);
server.get('/trending', GetTranding);
server.get('/search', GetSearch);

//Create request to the database
server.post('/addMovie', addBestMov);
server.get('/getMovies', getBestMov);

//delete and update methods
server.put('/update/:id', updateMovie);
server.delete('/DELETE/:id', deleteMovie);



//error handler
server.get('*', InCase);
server.get(errorFix);

const client = new pg.Client(process.env.DATABASE_URL)

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
    }).catch(error => {
        errorFix(error,req,res)
    })
}

//==================================== New Branch ===============================================
function addBestMov(req, res) {
    const mov = req.body;
    let sql = `INSERT INTO bestMovie(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let valArr= [mov.title , mov.release_date , mov.poster_path, mov.overview];
    client.query(sql,valArr).then(data =>{
        res.status(200).json(data.rows);
    }).catch(error => {
        errorFix(error,req,res)
    });
}

function getBestMov(req , res){
    let sql =`SELECT * FROM bestMovie;`
    client.query(sql).then(data =>{
        res.status(200).json(data.rows);
    }).catch(error => {
        errorFix(error,req,res)
    });
}


//==============================================================================================

//======================================Task14==================================================


function updateMovie(req , res){
    const id = req.params.id;
    const movie = req.body;
    const sql = `UPDATE bestMovie SET title = $1, release_date = $2, poster_path = $3, overview = $4 WHERE id = $5 RETURNING *;`;
    let movies = [movie.title, movie.release_date, movie.poster_path, movie.overview,id];
    client.query(sql,movies).then(data =>{
        res.status(200).json(data.rows)
    }).catch(error => {
        errorFix(error,req,res)
    });
}

function deleteMovie(req , res){
    const id = req.params.id;
    const sql = `DELETE FROM bestMovie WHERE id=${id};` 

    client.query(sql).then(()=>{
        res.status(204).json({});
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}


//=================================================================================================
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

client.connect().then(() => {
    server.listen(3000, () => {
        console.log("You'r now listening to 3000");
    })
})