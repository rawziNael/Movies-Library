"use strict";
const express = require('express');
const cors = require('cors');
const data = require('./data.json');


const server = express();
server.use(cors());

server.get('/' , Home);
server.get('/favorite' , Favorite);
server.get('*' , InCase1);
server.get('*' , InCase2);



function Info(data){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


function Home(request , response){
    let info =  Info(data);
    response.status(200).json(info);
}

function Favorite(request , response){
    response.status(200).send("Welcome to Favorite Page");
}

function  InCase1(request , response){
    response.status(404).send("We sorry, you chosed something not exist ");
}
function  InCase2(request , response){
    response.status(500).send("Sorry, something went wrong");
}

server.listen(3000 , ()=>{
    console.log("You'r now listening to Rawzi's server");
})