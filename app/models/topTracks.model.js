const mongoose = require("mongoose");

const TopTracksSchema = mongoose.Schema(
  {
    ArtistId: String,
    Hotness: String,
    Name: String,
    Sid: String,
    City: String,
    Lat: Number,
    Lng: Number,
    genres: Array,
    topTracks: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TopTracks.LimitedInfo.WithGenres",
  TopTracksSchema,
  "TopTracks.LimitedInfo.WithGenres"
);
