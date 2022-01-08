//dependencies
require ('dotenv').config();
//Port
const { PORT = 3001, DATABASE_URL } = process.env;
//import express
const express = require('express');
//application object
const app = express();
//import mongoose
const mongoose = require('mongoose');
//import middleware
const cors = require("cors");
const morgan = require("morgan");

//connection
mongoose.connect(DATABASE_URL)
mongoose.connection
    .on("open", () => console.log("You are connected to MongoDB"))
    .on("close", () => console.log("You are disconnected from MongoDB"))
    .on("error", (error) => console.log(error))

//model
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//routes
//test route
app.get('/', (req, res) => {
    res.send('Cheese App')
});

//index
app.get('/cheese', async (req, res) => {
    try{
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
});

//create
app.post('/cheese', async (req, res) => {
    try{
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

//delete
app.delete('/cheese/:id', async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
});

//update
app.put('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));