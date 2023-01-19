module.exports = app => {
  const events = require("../controllers/events.controller.js");
  

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

  // Retrieve all albums artists
  app.get("/eventsForLocation/:city", events.findAll);
};
