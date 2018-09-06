module.exports = app => {
  const topTracks = require("../controllers/topTracks.controller.js");

  // Create a new topTracks
  app.post("/topTracks", topTracks.create);

  // Retrieve all topTracks
  app.get("/topTracks", topTracks.findAll);

  // Retrieve a single track with artistId
  app.get("/topTracks/:id", topTracks.findOne);

  // Retrieve topTracks with name
  app.get("/topTracksName/:name", topTracks.findName);

  // Retrieve a single that matches a name
  app.get("/topTracksMatch/:name", topTracks.findMatch);

  // Retrieve all records that matches all parameters
  app.get("/topTracksMultiple/:params", topTracks.findMultipleParams);

  // Retrieve all records that matches all parameters
  app.get("/topTracksLatLng/:params", topTracks.findLatLng);

  // Update a topTrack with artistId
  app.put("/topTracks/:artistId", topTracks.update);

  // Delete a topTrack with artistId
  app.delete("/topTracks/:artistId", topTracks.delete);
};
