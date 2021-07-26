const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Campground = require('./models/campgrounds');

mongoose.connect('mongodb://localhost:27017/campgrounds', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once("open", () => {
    console.log("Database connected");
});


app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));


// Landing page
app.get('/', (req, res) => {
    res.render('home')
});

/**
 * CRUD functionality for campgrounds
 */
// Diplay all camp grounds
app.get('/campgrounds', async (req, res) => {
    // Find for all Campground models in our DB  
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds} );
});

// Look up corresponding campground in database
// GET async function
app.get('/campgrounds/:id', async (req, res) => {
    // Find for all Campground models in our DB  
    const campground = await Campground.findById(req.params.id); 
    res.render('campgrounds/show', { campground });
});


const port = 3000;
app.listen(port, () => {
    console.log("Serving port 3000")
});
