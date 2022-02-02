"use strict";

const express = require('express');
const cors = require('cors');
 Task12
const axios = require('axios');
const pg = require('pg');
// const PORT = process.env.PORT;
// const info = require('./data.json');


Task13
require('dotenv').config();


const info = require('./data.json');
 main

 main

const server = express();
server.use(cors());
server.use(express.json());

server.get('/', Home);
server.get('/favorite', Favorite);
Task12
server.get('/trending', GetTranding);
server.get('/search', GetSearch);

//Create request to the database
server.post('/addMovie', addBestMov);
server.get('/getMovies', getBestMov);

//error handler
server.get('*', InCase);
server.get(errorFix);

const client = new pg.Client(process.env.DATABASE_URL)

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;

server.get('*', InCase1);
server.get('*', InCase2);

function Info(title , poster_path ,overview) {
 main
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function Home(request, response) {
  
    let obj =  new Info(info.title , info.poster_path , info.overview);

 Task12
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

 Task13
//==================================== New Branch ===============================================
function addBestMov(req, res) {
    const mov = req.body;
    let sql = `INSERT INTO bestMovie(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let valArr= [mov.title , mov.release_date ,mov.poster_path,mov.overview];
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

    
    return response.status(200).json(obj);
}

 main
 main
function Favorite(request, response) {
    response.status(200).send("Welcome to Favorite Page");
}

 Task12
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

 Task13
client.connect().then(() => {
    server.listen(3000, () => {
        console.log("You'r now listening to 3000");
    })


server.listen(3000, () => {

function InCase1(request, response) {
    response.status(404).send("We sorry, you chosed something not exist ");
}
function InCase2(request, response) {
    response.status(500).send("Sorry, something went wrong");
}

server.listen(3000, () => {
    console.log("You'r now listening to Rawzi's server");
 main
 main
})