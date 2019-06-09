const mongoose = require("mongoose");

const SpotifyArtistsSchema = mongoose.Schema(
  {
    external_urls: Object,
    followers: Object,
    genres: Array,
    href: String,
    id: String,
    images: Array,
    name: String,
    popularity: Number,
    type: String,
    uri: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "SpotifyAritsts",
  SpotifyArtistsSchema,
  "SpotifyArtists"
);
