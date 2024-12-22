const geolocation = require("../models/geolocation.model.js");
const { createAggregateQuery, filterArr } = require("../helpers/helpers");

// Create and Save a new artist
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "artist content can not be empty"
    });
  }

  // Create a artist
  const geolocation = new geolocation({
    CountryID: req.body.CountryID,
    Country: req.body.Country,
    Region: req.body.Region,
    CityName: req.body.City,
    Lat: req.body.Lat,
    Long: req.body.Long
  });

  // Save geolocation in the database
  geolocation
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the geolocation."
      });
    });
};

// Retrieve and return all geolocation from the database.
exports.findAll = (req, res) => {
  geolocation
    .find()
    .then(geolocation => {
      res.send(geolocation);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving geolocation."
      });
    });
};

// Find a single geolocation with a artistId
exports.findOne = (req, res) => {
  const query = geolocation.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(geolocation.collection);
  query
    .where({ Sid: req.params.id })
    .then(geolocation => {
      if (!geolocation) {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      res.send(geolocation);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving geolocation with id " + req.params.artistId
      });
    });
};

exports.findName = (req, res) => {
  const query = geolocation.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(geolocation.collection);
  query
    .where({ Name: req.params.name })
    .then(geolocation => {
      if (!geolocation) {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      res.send(geolocation);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving geolocation with id " + req.params.artistId
      });
    });
};

// Find all geolocation by an artist that match a string
exports.findMatch = (req, res) => {
  const query = geolocation.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(geolocation.collection);
  var regex = new RegExp(req.params.name, "i");
  query
    .where({ Name: regex })
    .then(geolocation => {
      if (!geolocation) {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      res.send(geolocation);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving geolocation with id " + req.params.artistId
      });
    });
};

exports.findMultipleParams = (req, res) => {
  const aggregate = createAggregateQuery(req.params.params);
  const limit = parseInt(req.query.limit) || 100;
  const skip = parseInt(req.query.skip) || 0;

  geolocation
    .aggregate([
      {
        $match: aggregate
      },
      { $limit: limit },
      { $skip: skip }
    ])
    .then(geolocation => {
      console.log(geolocation);
      if (!geolocation) {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.params
        });
      }

      //res.send(geolocation);
      const str = req.params.params.split("~")[1] || req.params.params;
      const params = str.split("_");
      const geolocationParams = params.filter(param => {
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

      let geolocationArr = geolocation[0].geolocation;

      for (var x = 0; x < geolocationParams.length; x++) {
        const param = geolocationParams[x];
        const splitter = param.split(":");
        const key = splitter[0].split(".")[1] || splitter[0];
        const val = splitter[1];

        geolocationArr = filterArr(geolocationArr, key, val);
      }
      geolocation = geolocationParams.length > 1 ? geolocationArr : geolocation;

      res.send(geolocation);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.params
        });
      }
      return res.status(500).send({
        message: "Error retrieving geolocation with id " + req.params.params
      });
    });
};

// Find geolocation by artists from lat and lng
exports.findLatLng = (req, res) => {
  const params = req.params.params;
  const latLngArr = params.split("_");
  const lowerLat = parseFloat(latLngArr[0]) - 0.3;
  const upperLat = parseFloat(latLngArr[0]) + 0.3;
  const lowerLng = parseFloat(latLngArr[1]) - 0.3;
  const upperLng = parseFloat(latLngArr[1]) + 0.3;
  const limit = parseInt(req.query.limit) || 100;
  const skip = parseInt(req.query.skip) || 0;
  console.log(lowerLat, upperLat, lowerLng, upperLng)

  const query = geolocation.find(); // `query` is an instance of `Query`
  // query.setOptions({ lean: true });
  query.collection(geolocation.collection);

  query
     .and([
      { Lat: { $gte: lowerLat } },
      { Lat: { $lte: upperLat } },
      { Long: { $gte: lowerLng } },
      { Long: { $lte: upperLng } },
    ]).limit(limit).skip(skip)
    .then(geolocation => {
      console.log(geolocation)
      if (!geolocation) {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.params
        });
      }
      
      res.send(geolocation);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.params
        });
      }
      return res.status(500).send({
        message: "Error retrieving geolocation with id " + req.params.params
      });
    });
};

// Update a geolocation identified by the artistId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "geolocation content can not be empty"
    });
  }

  // Find geolocation and update it with the request body
  geolocation
    .findByIdAndUpdate(
      req.params.artistId,
      {
        title: req.body.title || "Untitled geolocation",
        content: req.body.content
      },
      { new: true }
    )
    .then(geolocation => {
      if (!geolocation) {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      res.send(geolocation);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error updating geolocation with id " + req.params.artistId
      });
    });
};

// Delete a geolocation with the specified artistId in the request
exports.delete = (req, res) => {
  geolocation
    .findByIdAndRemove(req.params.artistId)
    .then(geolocation => {
      if (!geolocation) {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      res.send({ message: "geolocation deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "geolocation not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Could not delete geolocation with id " + req.params.artistId
      });
    });
};