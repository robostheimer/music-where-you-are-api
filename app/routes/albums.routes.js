module.exports = app => {
  const albums = require("../controllers/albums.controller.js");

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

  // Create a new albums artists
  app.post("/albums", albums.create);

  // Retrieve all albums artists
  app.get("/albums", albums.findAll);

  // Retrieve a albums artists record track with artistId
  app.get("/albums/:id", albums.findOne);

  // Update a albums artist  record with artistId
  app.put("/albums/:artistId", albums.update);

  // Delete a albums artist record with artistId
  app.delete("/albums/:artistId", albums.delete);

  // Retrieve album with name
  app.get("/albumsName/:name", albums.findName);

  // Retrieve a single that matches a name
  app.get("/albumsMatch/:name", albums.findMatch);

  // Retrieve all records that matches all parameters
  app.get("/albumsMultiple/:params", albums.findMultipleParams);

  // Retrieve all records that matches all parameters
  app.get("/artistsLatLng/:params", albums.findLatLng);
};
