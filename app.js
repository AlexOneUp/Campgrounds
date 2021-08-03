const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

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

app.engine('ejs', ejsMate);
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
app.get('/campgrounds', catchAsync(async (req, res) => {
    // Find for all Campground models in our DB  
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// GET form to POST new Campground
app.get('/campgrounds/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}));

// POST new Campground from new.ejs form data onto database : campgrounds
app.post('/campgrounds', catchAsync(async (req, res, next) => {

    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),
            
        }).required()
    })
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    }
    console.log(result);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

// Look up corresponding campground in database
// GET async function
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    // Find for all Campground models in our DB  
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));

// Serves the form to be able to EDIT campgrounds
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    // Find for all Campground models in our DB  
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

// Update using methodOverride to update campgrounds by ID
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);

}));


app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

}));

// '*' means that for all paths
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// Catch all for any error
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong!"
    res.status(statusCode).render('error', { err });
});


const port = 3000;
app.listen(port, () => {
    console.log("Serving port 3000")
});


