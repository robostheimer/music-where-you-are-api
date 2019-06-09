const spotifyArtists = require("../models/spotify.artists.model.js");
const { createAggregateQuery } = require("../helpers/helpers");

// Create and Save a new spotifyArtists
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "spotifyArtists content can not be empty"
    });
  }

  // Create a spotifyArtists
  const spotifyArtists = new spotifyArtists({
    external_urls: req.body.external_urls || "Untitled spotifyArtists",
    followers: req.body.followers,
    genres: req.body.genres,
    href: req.body.href,
    id: req.body.id,
    images: req.body.images,
    name: req.body.name,
    popularity: req.body.popularity,
    type: req.body.type,
    uri: req.body.uri
  });

  // Save spotifyArtists in the database
  spotifyArtists
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the spotifyArtists."
      });
    });
};

// Retrieve and return all spotifyArtistss from the database.
exports.findAll = (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip) || 0;
  console.log(skip);
  spotifyArtists
    .aggregate([
      { $limit: limit },
      { $sort: { "followers.total": -1 } },
      { $skip: skip }
    ])
    .then(spotifyArtistss => {
      res.send(spotifyArtistss);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving spotifyArtistss."
      });
    });
};

// Find a single spotifyArtists by Name
exports.findOne = (req, res) => {
  const query = spotifyArtists.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(spotifyArtists.collection);
  query
    .where({ Sid: req.params.id })
    .then(spotifyArtists => {
      if (!spotifyArtists) {
        return res.status(404).send({
          message: "spotifyArtists not found with id " + req.params.id
        });
      }
      res.send(spotifyArtists);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "spotifyArtists not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving spotifyArtists with id " + req.params.id
      });
    });
};
// Find a single spotifyArtists by Name
exports.findName = (req, res) => {
  const query = spotifyArtists.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(spotifyArtists.collection);
  query
    .where({ name: req.params.name })
    .then(spotifyArtists => {
      console.log(spotifyArtists);
      if (!spotifyArtists) {
        return res.status(404).send({
          message:
            "spotifyArtists not found with id " + req.params.spotifyArtistsId
        });
      }
      res.send(spotifyArtists);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message:
            "spotifyArtists not found with id " + req.params.spotifyArtistsId
        });
      }
      return res.status(500).send({
        message:
          "Error retrieving spotifyArtists with id " +
          req.params.spotifyArtistsId
      });
    });
};

// Find all spotifyArtists that match a string
exports.findMatch = (req, res) => {
  const query = spotifyArtists.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(spotifyArtists.collection);
  var regex = new RegExp(req.params.name, "i");
  query
    .where({ name: regex })
    .then(spotifyArtists => {
      if (!spotifyArtists) {
        return res.status(404).send({
          message:
            "spotifyArtists not found with id " + req.params.spotifyArtistsId
        });
      }
      res.send(spotifyArtists);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message:
            "spotifyArtists not found with id " + req.params.spotifyArtistsId
        });
      }
      return res.status(500).send({
        message:
          "Error retrieving spotifyArtists with id " +
          req.params.spotifyArtistsId
      });
    });
};

// TODO figure out how to have some and params and some or params. See mongoose docs (perhaps use IN)
// ex. spotifyArtistss from seattle && (genres match hip hop or genres match folk )
// need to use aggregate queries so a request looks like:
// http://localhost:3000/spotifyArtistssMultiple/and~City:Seattle,%20WA(or~spotify.genres:indie%20folk_spotify.genres:rock)
exports.findMultipleParams = (req, res) => {
  console.log(req.params.params);
  const letter = req.params.params.split(":");
  const aggregate = { name: /^Z.*/i }; //createAggregateQuery(req.params.params);
  const limit = parseInt(req.query.limit) || 100;
  const skip = parseInt(req.query.skip) || 0;
  spotifyArtists
    .aggregate([
      {
        $match: aggregate
      },
      { $limit: limit },
      { $sort: { "spotify.followers.total": -1 } },
      { $skip: skip }
    ])
    .then(spotifyArtists => {
      if (!spotifyArtists) {
        return res.status(404).send({
          message: "spotifyArtists not found with id " + req.params.params
        });
      }
      res.send(spotifyArtists);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "spotifyArtists not found with id " + req.params.params
        });
      }
      return res.status(500).send({
        message: "Error retrieving spotifyArtists with id " + req.params.params
      });
    });
};

// Find spotifyArtistss from lat and lng
exports.findLatLng = (req, res) => {
  const params = req.params.params;
  const latLngArr = params.split("_");
  const lowerLat = parseFloat(latLngArr[0]) - 0.05;
  const upperLat = parseFloat(latLngArr[0]) + 0.05;
  const lowerLng = parseFloat(latLngArr[1]) - 0.05;
  const upperLng = parseFloat(latLngArr[1]) + 0.05;

  const query = spotifyArtists.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(spotifyArtists.collection);
  query
    .and([
      { Lat: { $gte: lowerLat } },
      { Lat: { $lte: upperLat } },
      { Lng: { $gte: lowerLng } },
      { Lng: { $lte: upperLng } }
    ])
    .then(spotifyArtists => {
      if (!spotifyArtists) {
        return res.status(404).send({
          message: "spotifyArtists not found with id " + req.params.params
        });
      }
      res.send(spotifyArtists);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "spotifyArtists not found with id " + req.params.params
        });
      }
      return res.status(500).send({
        message: "Error retrieving spotifyArtists with id " + req.params.params
      });
    });
};

// Update a spotifyArtists identified by the spotifyArtistsId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "spotifyArtists content can not be empty"
    });
  }

  // Find spotifyArtists and update it with the request body
  spotifyArtists
    .findByIdAndUpdate(
      req.params.spotifyArtistsId,
      {
        title: req.body.title || "Untitled spotifyArtists",
        content: req.body.content
      },
      { new: true }
    )
    .then(spotifyArtists => {
      if (!spotifyArtists) {
        return res.status(404).send({
          message:
            "spotifyArtists not found with id " + req.params.spotifyArtistsId
        });
      }
      res.send(spotifyArtists);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message:
            "spotifyArtists not found with id " + req.params.spotifyArtistsId
        });
      }
      return res.status(500).send({
        message:
          "Error updating spotifyArtists with id " + req.params.spotifyArtistsId
      });
    });
};

// Delete a spotifyArtists with the specified spotifyArtistsId in the request
exports.delete = (req, res) => {
  spotifyArtists
    .findByIdAndRemove(req.params.spotifyArtistsId)
    .then(spotifyArtists => {
      if (!spotifyArtists) {
        return res.status(404).send({
          message:
            "spotifyArtists not found with id " + req.params.spotifyArtistsId
        });
      }
      res.send({ message: "spotifyArtists deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message:
            "spotifyArtists not found with id " + req.params.spotifyArtistsId
        });
      }
      return res.status(500).send({
        message:
          "Could not delete spotifyArtists with id " +
          req.params.spotifyArtistsId
      });
    });
};
