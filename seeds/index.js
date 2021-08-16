
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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
    // await Campground.deleteMany({});

    let i = 0;
    while (i < 500) {
        i++;
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            // Each instance of Campground will have a ref to author which is a ref to the Object ID in our db
            // YOUR USER ID
            author: '611aa88e8b7d8c61ff511d30',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In consequatur, facilis eveniet quo aliquid cum illum minus ab officiis dolore, fugit eius, nulla cupiditate. Ratione eum deleniti nisi consequuntur cumque!',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwj1go2eh/image/upload/v1628893266/Campgrounds/jrl25k8ylfjej3i1gyii.jpg',
                    filename: 'Campgrounds/jrl25k8ylfjej3i1gyii'
                },
                {
                    url: 'https://res.cloudinary.com/dwj1go2eh/image/upload/v1628893266/Campgrounds/tdrsrrtx6upechvpfqix.jpg',
                    filename: 'Campgrounds/tdrsrrtx6upechvpfqix'
                },
                {
                    url: 'https://res.cloudinary.com/dwj1go2eh/image/upload/v1628893266/Campgrounds/n2jbkkinlcbhri6p9cyp.jpg',
                    filename: 'Campgrounds/n2jbkkinlcbhri6p9cyp'
                },
                {
                    url: 'https://res.cloudinary.com/dwj1go2eh/image/upload/v1628893267/Campgrounds/icu4kh0ilogzltxiu45h.jpg',
                    filename: 'Campgrounds/icu4kh0ilogzltxiu45h'
                },
                {
                    url: 'https://res.cloudinary.com/dwj1go2eh/image/upload/v1628893267/Campgrounds/a0fephbqdy7gscd10nnk.jpg',
                    filename: 'Campgrounds/a0fephbqdy7gscd10nnk'
                }
            ]
        })
        await camp.save();
    }
};


dbSeeder().then(() => {
    mongoose.connection.close();
});