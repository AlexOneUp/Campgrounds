const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');

const methodOverride = require('method-override');

const campgrounds = require('./routes/campgroundRoutes');
const reviews = require('./routes/reviewsRoutes');

mongoose.connect('mongodb://localhost:27017/campgrounds', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

// look at public directory
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // Date.now() counts milliseconds
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Flash notification to client-side
app.use(flash());
// Middleware makes this available to all templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// campgroundRoutes
app.use('/campgrounds', campgrounds);
// reviewsRoutes
app.use('/campgrounds/:id/reviews', reviews);

// Landing page
app.get('/', (req, res) => {
    res.render('home')
});


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


