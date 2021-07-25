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

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({title: 'My Backyard', description: "cheap camping"});
    await camp.save();
    res.send(camp);
});

const port = 3000;
app.listen(3000, () => {
    console.log("Serving port 3000")
});
