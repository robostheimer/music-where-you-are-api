const topTracks = require("../models/topTracks.model.js");
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
  const topTracks = new toptracks({
    title: req.body.title || "Untitled topTracks",
    content: req.body.content,
    ArtistId: req.body.ArtistId,
    Hotness: req.body.Hotness,
    Name: req.body.Name,
    Sid: req.body.Sid,
    City: req.body.City,
    Lat: req.body.Lat,
    Lng: req.body.Lng,
    genres: [],
    spotify: req.body.spotify | {}
  });

  // Save topTracks in the database
  topTracks
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the topTracks."
      });
    });
};

// Retrieve and return all topTracks from the database.
exports.findAll = (req, res) => {
  topTracks
    .find()
    .then(topTracks => {
      res.send(topTracks);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving topTracks."
      });
    });
};

// Find a single topTracks with a artistId
exports.findOne = (req, res) => {
  const query = topTracks.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(topTracks.LimitedInfo.WithGenres.collection);
  query
    .where({ Sid: req.params.id })
    .then(topTracks => {
      if (!topTracks) {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      res.send(topTracks);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving topTracks with id " + req.params.artistId
      });
    });
};

exports.findName = (req, res) => {
  const query = topTracks.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(topTracks.LimitedInfo.WithGenres.collection);
  query
    .where({ Name: req.params.name })
    .then(topTracks => {
      if (!topTracks) {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      res.send(topTracks);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving topTracks with id " + req.params.artistId
      });
    });
};

// Find all topTracks by an artist that match a string
exports.findMatch = (req, res) => {
  const query = topTracks.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(topTracks.LimitedInfo.WithGenres.collection);
  var regex = new RegExp(req.params.name, "i");
  query
    .where({ Name: regex })
    .then(topTracks => {
      if (!topTracks) {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      res.send(topTracks);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving topTracks with id " + req.params.artistId
      });
    });
};

exports.findMultipleParams = (req, res) => {
  const aggregate = createAggregateQuery(req.params.params);

  topTracks
    .aggregate([
      {
        $match: aggregate
      }
    ])
    .then(topTracks => {
      if (!topTracks) {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.params
        });
      }
      const str = req.params.params.split("~")[1] || req.params.params;
      const params = str.split("_");
      const topTracksParams = params.filter(param => {
        return param.indexOf(".") > -1;
      });

      let topTracksArr = topTracks[0].topTracks;

      for (var x = 0; x < topTracksParams.length; x++) {
        const param = topTracksParams[x];
        const splitter = param.split(":");
        const key = splitter[0].split(".")[1] || splitter[0];
        const val = splitter[1];
        topTracksArr = filterArr(topTracksArr, key, val);
      }
      topTracks[0].topTracks = topTracksArr;

      res.send(topTracks[0]);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.params
        });
      }
      return res.status(500).send({
        message: "Error retrieving topTracks with id " + req.params.params
      });
    });
};

// Find topTracks by artists from lat and lng
exports.findLatLng = (req, res) => {
  const params = req.params.params;
  const latLngArr = params.split("_");
  const lowerLat = parseFloat(latLngArr[0]) - 0.05;
  const upperLat = parseFloat(latLngArr[0]) + 0.05;
  const lowerLng = parseFloat(latLngArr[1]) - 0.05;
  const upperLng = parseFloat(latLngArr[1]) + 0.05;

  const query = topTracks.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(topTracks.LimitedInfo.WithGenres.collection);

  query
    .and([
      { Lat: { $gte: lowerLat } },
      { Lat: { $lte: upperLat } },
      { Lng: { $gte: lowerLng } },
      { Lng: { $lte: upperLng } }
    ])
    .then(topTracks => {
      if (!topTracks) {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.params
        });
      }
      res.send(topTracks);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.params
        });
      }
      return res.status(500).send({
        message: "Error retrieving topTracks with id " + req.params.params
      });
    });
};

// Update a topTracks identified by the artistId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "topTracks content can not be empty"
    });
  }

  // Find topTracks and update it with the request body
  topTracks
    .findByIdAndUpdate(
      req.params.artistId,
      {
        title: req.body.title || "Untitled topTracks",
        content: req.body.content
      },
      { new: true }
    )
    .then(topTracks => {
      if (!topTracks) {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      res.send(topTracks);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error updating topTracks with id " + req.params.artistId
      });
    });
};

// Delete a topTracks with the specified artistId in the request
exports.delete = (req, res) => {
  topTracks
    .findByIdAndRemove(req.params.artistId)
    .then(topTracks => {
      if (!topTracks) {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      res.send({ message: "topTracks deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "topTracks not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Could not delete topTracks with id " + req.params.artistId
      });
    });
};
