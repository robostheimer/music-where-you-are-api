module.exports = app => {
  const artists = require("../controllers/artist.controller.js");

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
  app.post("/artists", artists.create);

  // Retrieve all artists
  app.get("/artists", artists.findAll);

  // Retrieve a single artist with artistId
  app.get("/artists/:id", artists.findOne);

  // Retrieve artists with name
  app.get("/artistsName/:name", artists.findName);

  // Retrieve a single that matches a name
  app.get("/artistsMatch/:name", artists.findMatch);

  // Retrieve all records that matches all parameters
  app.get("/artistsMultiple/:params", artists.findMultipleParams);

  // Retrieve all records that matches all parameters
  app.get("/artistsLatLng/:params", artists.findLatLng);

  // Update a artist with artistId
  app.put("/artists/:artistId", artists.update);

  // Delete a artist with artistId
  app.delete("/artists/:artistId", artists.delete);
};
