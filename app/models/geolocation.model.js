const mongoose = require("mongoose");

const GeolocationSchema = mongoose.Schema(
  {
    CountryID: String,
    Country: String,
    Region: String,
    City: String,
    Lat: String,
    Long: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Geolocation",
  GeolocationSchema,
  "Geolocation"
);
