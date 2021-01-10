const express = require("express");
const bodyParser = require("body-parser");
var https = require("https");
var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || "";
var fs = require("fs");

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url)
  .then((data) => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
  });

// Require routes
require("./app/routes/artist.routes.js")(app);
require("./app/routes/topTracks.routes.js")(app);
require("./app/routes/related.routes.js")(app);
require("./app/routes/albums.routes.js")(app);
require("./app/routes/geolocation.routes.js")(app);
require("./app/routes/location.routes.js")(app);
require("./app/routes/spotify.artists.routes.js")(app);

// sets headers
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

// define a simple route
app.get("/*", (req, res) => {
  res.json({
    message: "MusicWhereYouAre endpoints.  Is there music where you are?",
  });
});

// listen for requests
// app.listen(3000, () => {
//   console.log("Server is listening on port 3000");
// });

var options = {
  key: fs.readFileSync("ssl/server.key"),
  cert: fs.readFileSync("ssl/server.crt"),
};

https.createServer(options, app).listen(PORT, HOST, null, function () {
  console.log(
    "Server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
