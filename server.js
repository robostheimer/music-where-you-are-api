const express = require("express");
const bodyParser = require("body-parser");

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
  .then(data => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
  });

// Require routes
require("./app/routes/artist.routes.js")(app);
require("./app/routes/topTracks.routes.js")(app);
require("./app/routes/related.routes.js")(app);
require("./app/routes/albums.routes.js")(app);

// define a simple route
app.get("/", (req, res) => {
  response.writeHead(200, {
    "Content-Length": res.length,
    "Content-Type": "application/json; charset=UTF-8",
    "Cache-Control": "public, max-age=60, must-revalidate, no-transform",
    "Access-Control-Allow-Credentials": true
  });
  res.json({
    message: "MusicWhereYouAre endpoints.  Is there music where you are?"
  });
});

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
