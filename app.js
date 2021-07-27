const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const methodOverride = require('method-override');

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

// Parse form body views/campgrounds/new.ejs
app.use(express.urlencoded({ extended: true }));
// for PUT, PATCH, DELETE routes
app.use(methodOverride('_method'));

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

// GET form to POST new Campground
app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new');
});

// POST new Campground from new.ejs form data onto database : campgrounds
app.post('/campgrounds', async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
});

// Look up corresponding campground in database
// GET async function
app.get('/campgrounds/:id', async (req, res) => {
    // Find for all Campground models in our DB  
    const campground = await Campground.findById(req.params.id); 
    res.render('campgrounds/show', { campground });
});

// Serves the form to be able to EDIT campgrounds
app.get('/campgrounds/:id/edit', async (req, res) => {
    // Find for all Campground models in our DB  
    const campground = await Campground.findById(req.params.id); 
    res.render('campgrounds/edit', { campground });
});

// Update using methodOverride to update campgrounds by ID
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);

});


app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

});


const port = 3000;
app.listen(port, () => {
    console.log("Serving port 3000")
});
