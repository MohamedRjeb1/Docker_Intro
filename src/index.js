const express = require('express');
const mongoose = require("mongoose");
const redis =require("redis");
const DB_USER= 'root';
const DB_PASS= 'example';
const DB_PORT= 27017;
const DB_HOST= 'mongo';
const redisPort = 6379;
const redisHost ='redis';
const redisClient = redis.createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  redisClient.on("connect", () => console.log("connected to redis.."));
  redisClient.connect();
mongoose
.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}`)
.then(() => console.log("connect to db..."))
.catch((err) => console.log("erreur de connexion"));
const PORT = 4000;
const app = express();

app.get('/', (req, res) => {

    redisClient.set("products","Anta,nike,adidas")
    res.send('<h1>mohamed  conversation </h1>');});

app.get('/', async(req, res) => {

    const products = await redisClient.get('products');
    res.send(`<h1>mohamed  conversation </h1><h2>${products}</h2>`);});

app.listen(PORT, () => console.log(`app is up and running on port : ${PORT}`))

