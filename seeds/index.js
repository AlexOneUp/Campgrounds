
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
        const price = Math.floor(Math.random()*20) + 10;

        const camp = new Campground({
            // Each instance of Campground will have a ref to author which is a ref to the Object ID in our db
            author:'61134043c3331e50c61f3273',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In consequatur, facilis eveniet quo aliquid cum illum minus ab officiis dolore, fugit eius, nulla cupiditate. Ratione eum deleniti nisi consequuntur cumque!',
            price
        })
        await camp.save();
    }
};


dbSeeder().then(() => {
    mongoose.connection.close();
});