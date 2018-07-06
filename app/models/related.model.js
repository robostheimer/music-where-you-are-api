const mongoose = require('mongoose');

const RelatedSchema = mongoose.Schema({
    ArtistId: String,
    Hotness: String,
    Name: String,
    Sid: String,
    City: String,
    Lat: Number,
    Lng: Number,
    related: Object,

}, {
        timestamps: true
    });

module.exports = mongoose.model('Related', RelatedSchema, 'Related');