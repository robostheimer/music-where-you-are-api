const artist = require("../models/artist.model.js");
const { createAggregateQuery } = require("../helpers/helpers");

// Create and Save a new artist
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "artist content can not be empty",
    });
  }

  // Create a artist
  const artist = new artist({
    title: req.body.title || "Untitled artist",
    content: req.body.content,
    ArtistId: req.body.ArtistId,
    Hotness: req.body.Hotness,
    Name: req.body.Name,
    Sid: req.body.Sid,
    City: req.body.City,
    Lat: req.body.Lat,
    Lng: req.body.Lng,
    spotify: req.body.spotify | {},
  });

  // Save artist in the database
  artist
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the artist.",
      });
    });
};

// Retrieve and return all artists from the database.
exports.findAll = (req, res) => {
  artist
    .find()
    .then((artists) => {
      res.send(artists);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving artists.",
      });
    });
};

// Find a single artist by Name
exports.findOne = (req, res) => {
  console.log(req.params.id);
  const query = artist.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(artist.collection);
  query
    .where({ Sid: req.params.id })
    .then((artist) => {
      if (!artist) {
        return res.status(404).send({
          message: "artist not found with id " + req.params.id,
        });
      }
      res.send(artist);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "artist not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving artist with id " + req.params.id,
      });
    });
};
// Find a single artist by Name
exports.findName = (req, res) => {
  const query = artist.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(artist.collection);
  query
    .where({ Name: req.params.name })
    .then((artist) => {
      if (!artist) {
        return res.status(404).send({
          message: "artist not found with id " + req.params.artistId,
        });
      }
      res.send(artist);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "artist not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving artist with id " + req.params.artistId,
      });
    });
};

// Find all artist that match a string
exports.findMatch = (req, res) => {
  const query = artist.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(artist.collection);
  var regex = new RegExp(req.params.name, "i");
  query
    .where({ Name: regex })
    .then((artist) => {
      if (!artist) {
        return res.status(404).send({
          message: "artist not found with id " + req.params.artistId,
        });
      }
      res.send(artist);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "artist not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving artist with id " + req.params.artistId,
      });
    });
};

// TODO figure out how to have some and params and some or params. See mongoose docs (perhaps use IN)
// ex. artists from seattle && (genres match hip hop or genres match folk )
// need to use aggregate queries so a request looks like:
// http://localhost:3000/artistsMultiple/and~City:Seattle,%20WA(or~spotify.genres:indie%20folk_spotify.genres:rock)
exports.findMultipleParams = (req, res) => {
  const aggregate = createAggregateQuery(req.params.params);
  const limit = parseInt(req.query.limit) || 100;
  const sort = req.query.sort || "spotify.popularity";
  const skip = parseInt(req.query.skip) || 0;
  artist
    .aggregate([
      {
        $match: aggregate,
      },
      { $limit: limit },
      { $sort: { "spotify.popularity": -1 } },
      { $skip: skip },
    ])
    .then((artist) => {
      if (!artist) {
        return res.status(404).send({
          message: "artist not found with id " + req.params.params,
        });
      }
      res.send(artist);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "artist not found with id " + req.params.params,
        });
      }
      return res.status(500).send({
        message: "Error retrieving artist with id " + req.params.params,
      });
    });
};

// Find artists from lat and lng
exports.findLatLng = (req, res) => {
  const params = req.params.params;
  const latLngArr = params.split("_");
  const lowerLat = parseFloat(latLngArr[0]) - 0.05;
  const upperLat = parseFloat(latLngArr[0]) + 0.05;
  const lowerLng = parseFloat(latLngArr[1]) - 0.05;
  const upperLng = parseFloat(latLngArr[1]) + 0.05;
  const limit = parseInt(req.query.limit) || 100;

  const query = artist.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(artist.collection);
  query
    .and([
      { Lat: { $gte: lowerLat } },
      { Lat: { $lte: upperLat } },
      { Lng: { $gte: lowerLng } },
      { Lng: { $lte: upperLng } },
    ]).sort(
    { 
        "spotify.popularity" : -1.0
    }).limit(limit)
    .then((artist) => {
      if (!artist) {
        return res.status(404).send({
          message: "artist not found with id " + req.params.params,
        });
      }
      res.send(artist);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "artist not found with id " + req.params.params,
        });
      }
      return res.status(500).send({
        message: "Error retrieving artist with id " + req.params.params,
      });
    });
};

// Update a artist identified by the artistId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "artist content can not be empty",
    });
  }

  // Find artist and update it with the request body
  artist
    .findByIdAndUpdate(
      req.params.artistId,
      {
        title: req.body.title || "Untitled artist",
        content: req.body.content,
      },
      { new: true }
    )
    .then((artist) => {
      if (!artist) {
        return res.status(404).send({
          message: "artist not found with id " + req.params.artistId,
        });
      }
      res.send(artist);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "artist not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Error updating artist with id " + req.params.artistId,
      });
    });
};

// Delete a artist with the specified artistId in the request
exports.delete = (req, res) => {
  artist
    .findByIdAndRemove(req.params.artistId)
    .then((artist) => {
      if (!artist) {
        return res.status(404).send({
          message: "artist not found with id " + req.params.artistId,
        });
      }
      res.send({ message: "artist deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "artist not found with id " + req.params.artistId,
        });
      }
      return res.status(500).send({
        message: "Could not delete artist with id " + req.params.artistId,
      });
    });
};
