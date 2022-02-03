const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300')
})

const opts = {toJSON:{virtuals: true}};

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            require: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 40)}...</p>`
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteOne({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Campground', CampgroundSchema);