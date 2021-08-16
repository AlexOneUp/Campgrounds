if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const session = require('express-session');

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');

const mongoSanitize = require('express-mongo-sanitize');

/**
 * Storing sessions using MongoDB and keeping sessions
 * connect-mongo v4.4.1 is different from the lesson
 * REVERTED TO connect-mongo@3.2.0
 */
// const { MongoStore } = require('connect-mongo');
const MongoDBStore = require('connect-mongo')(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/campgrounds';
mongoose.connect(dbUrl, {
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

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));

// Parse form body views/campgrounds/new.ejs
app.use(express.urlencoded({ extended: true }));
// for PUT, PATCH, DELETE routes
app.use(methodOverride('_method'));

// look at public directory
app.use(express.static(path.join(__dirname, 'public')));

// Using Mongo to store sessions
const secret = process.env.LOCAL_SECRET || 'developmentsecret';
/**
 * Reference :
 * https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/22361206#questions/14175216
 * for more details on connect-mongo v3.2.0
 * Also, alternatively refer to the connect-mongo@3.2.0 docs here:
 * https://www.npmjs.com/package/connect-mongo/v/3.2.0
 */
const store = new MongoDBStore({
    url: dbUrl,
    touchAfter: 24 * 60 * 60, //In seconds
    secret,
});
store.on('error', function (err) {
    console.log('Session Error Store', err)
})


// Session cookies
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // Only turn on secure connections when deployed
        // secure: true,
        // Date.now() counts milliseconds
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Flash notification to client-side
app.use(flash());

// Helmet Middleware
app.use(helmet());
// Tell helmet to allow these scripts
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwj1go2eh/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Sanitize mongo queries
app.use(mongoSanitize());

// Middleware makes this available to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
// campgroundRoutes
app.use('/campgrounds', campgroundRoutes);
// reviewsRoutes
app.use('/campgrounds/:id/reviews', reviewRoutes);

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


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving port ${port}`)
});


