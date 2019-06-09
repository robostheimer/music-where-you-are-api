const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema(
  {
    geonameId: Number,
    continentCode: String,
    continentName: String,
    CountryAB: String,
    Country: String,
    RegionID: String,
    Region: String,
    City: String,
    metroCode: String,
    timeZone: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Location", LocationSchema, "Location");
