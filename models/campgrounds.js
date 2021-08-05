// Modeling for DB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// Query Middleware
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    //    If a document was found, remove all reviews in the document associated with document
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);