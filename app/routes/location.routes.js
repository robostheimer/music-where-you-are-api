module.exports = app => {
  const location = require("../controllers/location.controller.js");

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

  // Create a new location
  app.post("/location", location.create);

  // Retrieve all location
  app.get("/location", location.findAll);

  // Retrieve a single track with artistId
  app.get("/location/:id", location.findOne);

  // Retrieve location with name
  app.get("/locationName/:name", location.findName);

  // Retrieve a single that matches a name
  app.get("/locationMatch/:name", location.findMatch);

  // Retrieve all records that matches all parameters
  app.get("/locationMultiple/:params", location.findMultipleParams);

  // Retrieve all records that matches all parameters
  app.get("/locationLatLng/:params", location.findLatLng);

  // Update a topTrack with artistId
  app.put("/location/:artistId", location.update);

  // Delete a topTrack with artistId
  app.delete("/location/:artistId", location.delete);
};
