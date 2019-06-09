module.exports = app => {
  const geolocation = require("../controllers/geolocation.controller.js");

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

  // Create a new geolocation
  app.post("/geolocation", geolocation.create);

  // Retrieve all geolocation
  app.get("/geolocation", geolocation.findAll);

  // Retrieve a single track with artistId
  app.get("/geolocation/:id", geolocation.findOne);

  // Retrieve geolocation with name
  app.get("/geolocationName/:name", geolocation.findName);

  // Retrieve a single that matches a name
  app.get("/geolocationMatch/:name", geolocation.findMatch);

  // Retrieve all records that matches all parameters
  app.get("/geolocationMultiple/:params", geolocation.findMultipleParams);

  // Retrieve all records that matches all parameters
  app.get("/geolocationLatLng/:params", geolocation.findLatLng);

  // Update a topTrack with artistId
  app.put("/geolocation/:artistId", geolocation.update);

  // Delete a topTrack with artistId
  app.delete("/geolocation/:artistId", geolocation.delete);
};
