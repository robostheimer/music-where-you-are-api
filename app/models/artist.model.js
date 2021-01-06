const mongoose = require("mongoose");

const ArtistSchema = mongoose.Schema(
  {
    ArtistId: String,
    Hotness: String,
    Name: String,
    Sid: String,
    City: String,
    Lat: Number,
    Lng: Number,
    spotify: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Artist", ArtistSchema, "ArtistInfo");
