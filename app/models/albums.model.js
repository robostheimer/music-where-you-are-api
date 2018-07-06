const mongoose = require('mongoose');

const AlbumsSchema = mongoose.Schema({
    ArtistId: String,
    Hotness: String,
    Name: String,
    Sid: String,
    City: String,
    Lat: Number,
    Lng: Number,
    albums: Object,

}, {
        timestamps: true
    });

module.exports = mongoose.model('Albums', AlbumsSchema, 'Albums');