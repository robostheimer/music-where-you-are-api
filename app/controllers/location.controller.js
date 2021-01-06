const location = require("../models/location.model.js");
const { createAggregateQuery, filterArr } = require("../helpers/helpers");

// Create and Save a new artist
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "artist content can not be empty",
    });
  }

  // Create a artist
  const location = new location({
    geonameId: req.body.geoname_id,
    continentCode: req.body.continent_code,
    continentName: req.body.continent_name,
    CountryAB: req.body.CountryAB,
    Country: req.body.Country,
    RegionID: req.body.RegionID,
    Region: req.body.Region,
    City: req.body.City,
    metroCode: req.body.metroCode,
    timeZone: req.body.timeZone,
  });

  // Save location in the database
  location
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the location.",
      });
    });
};

// Retrieve and return all location from the database.
exports.findAll = (req, res) => {
  location
    .find()
    .then((location) => {
      res.send(location);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving location.",
      });
    });
};

// Find a single location with a artistId
exports.findOne = (req, res) => {
  const query = location.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(location.collection);
  query
    .where({ Sid: req.params.id })
    .then((location) => {
      if (!location) {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      res.send(location);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving location with id " + req.params.artistId,
      });
    });
};

exports.findName = (req, res) => {
  const query = location.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(location.collection);
  query
    .where({ Name: req.params.name })
    .then((location) => {
      if (!location) {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      res.send(location);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving location with id " + req.params.artistId,
      });
    });
};

// Find all location by an artist that match a string
exports.findMatch = (req, res) => {
  const query = location.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(location.collection);
  var regex = new RegExp(req.params.name, "i");
  query
    .where({ Name: regex })
    .then((location) => {
      if (!location) {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      res.send(location);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving location with id " + req.params.artistId,
      });
    });
};

exports.findMultipleParams = (req, res) => {
  const aggregate = createAggregateQuery(req.params.params);
  const limit = parseInt(req.query.limit) || 100;
  const skip = parseInt(req.query.skip) || 0;

  location
    .aggregate([
      {
        $match: aggregate,
      },

      { $sort: { "location.popularity": -1 } },
      { $skip: skip },
    ])
    .limit(limit)
    .then((location) => {
      console.log(location);
      if (!location) {
        return res.status(404).send({
          message: "location not found with id " + req.params.params,
        });
      }

      //res.send(location);
      const str = req.params.params.split("~")[1] || req.params.params;
      const params = str.split("_");
      const geolocationParams = params.filter((param) => {
        return (
          param.indexOf(".") > -1 &&
          /Name/.test(param) &&
          /Lat/.test(param) &&
          /Lng/.test(param) &&
          /Sid/.test(param) &&
          /City/.test(param) &&
          /genres/.test(param)
        );
      });

      let geolocationArr = location[0].location;

      for (var x = 0; x < geolocationParams.length; x++) {
        const param = geolocationParams[x];
        const splitter = param.split(":");
        const key = splitter[0].split(".")[1] || splitter[0];
        const val = splitter[1];

        geolocationArr = filterArr(geolocationArr, key, val);
      }
      location = geolocationParams.length > 1 ? geolocationArr : location;

      res.send(location);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "location not found with id " + req.params.params,
        });
      }
      return res.status(500).send({
        message: "Error retrieving location with id " + req.params.params,
      });
    });
};

// Find location by artists from lat and lng
exports.findLatLng = (req, res) => {
  const params = req.params.params;
  const latLngArr = params.split("_");
  const lowerLat = parseFloat(latLngArr[0]) - 0.05;
  const upperLat = parseFloat(latLngArr[0]) + 0.05;
  const lowerLng = parseFloat(latLngArr[1]) - 0.05;
  const upperLng = parseFloat(latLngArr[1]) + 0.05;

  const query = location.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(location.collection);

  query
    .and([
      { Lat: { $gte: lowerLat } },
      { Lat: { $lte: upperLat } },
      { Lng: { $gte: lowerLng } },
      { Lng: { $lte: upperLng } },
    ])
    .then((location) => {
      if (!location) {
        return res.status(404).send({
          message: "location not found with id " + req.params.params,
        });
      }
      res.send(location);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "location not found with id " + req.params.params,
        });
      }
      return res.status(500).send({
        message: "Error retrieving location with id " + req.params.params,
      });
    });
};

// Update a location identified by the artistId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "location content can not be empty",
    });
  }

  // Find location and update it with the request body
  location
    .findByIdAndUpdate(
      req.params.artistId,
      {
        title: req.body.title || "Untitled location",
        content: req.body.content,
      },
      { new: true }
    )
    .then((location) => {
      if (!location) {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      res.send(location);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Error updating location with id " + req.params.artistId,
      });
    });
};

// Delete a location with the specified artistId in the request
exports.delete = (req, res) => {
  location
    .findByIdAndRemove(req.params.artistId)
    .then((location) => {
      if (!location) {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      res.send({ message: "location deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "location not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Could not delete location with id " + req.params.artistId,
      });
    });
};
