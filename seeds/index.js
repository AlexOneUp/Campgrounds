
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers'); 

const Campground = require('../models/campgrounds');

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

/**
 * This function seeds our database with random seed information.
 * 
 */ 
const sample = array => array[Math.floor(Math.random() * array.length)];
const dbSeeder = async () => {
    // Delete all seeds to later repopulate the database
    await Campground.deleteMany({});
    
    let i = 0;
    while (i<50){
        i++;
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
};
dbSeeder();