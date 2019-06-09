module.exports = app => {
  const spotifyArtists = require("../controllers/spotify.artists.controller.js");

  app.get("/*", (req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=UTF-8");
    res.setHeader(
      "Cache-Control",
      "public, max-age=60, must-revalidate, no-transform"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });

  // Create a new artist
  app.post("/spotifyArtists", spotifyArtists.create);

  // Retrieve all spotifyArtists
  app.get("/spotifyArtists", spotifyArtists.findAll);

  // Retrieve a single artist with artistId
  app.get("/spotifyArtists/:id", spotifyArtists.findOne);

  // Retrieve spotifyArtists with name
  app.get("/spotifyArtistsName/:name", spotifyArtists.findName);

  // Retrieve a single that matches a name
  app.get("/spotifyArtistsMatch/:name", spotifyArtists.findMatch);

  // Retrieve all records that matches all parameters
  app.get("/spotifyArtistsMultiple/:params", spotifyArtists.findMultipleParams);

  // Retrieve all records that matches all parameters
  app.get("/spotifyArtistsLatLng/:params", spotifyArtists.findLatLng);

  // Update a artist with artistId
  app.put("/spotifyArtists/:artistId", spotifyArtists.update);

  // Delete a artist with artistId
  app.delete("/spotifyArtists/:artistId", spotifyArtists.delete);
};
