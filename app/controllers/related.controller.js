const related = require("../models/related.model.js");
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
  const related = new related({
    title: req.body.title || "Untitled related",
    content: req.body.content,
    ArtistId: req.body.ArtistId,
    Hotness: req.body.Hotness,
    Name: req.body.Name,
    Sid: req.body.Sid,
    City: req.body.City,
    Lat: req.body.Lat,
    Lng: req.body.Lng,
    spotify: req.body.spotify | {}
  });

  // Save related in the database
  related
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the related."
      });
    });
};

// Retrieve and return all related from the database.
exports.findAll = (req, res) => {
  related
    .find()
    .then(related => {
      res.send(related);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving related."
      });
    });
};

// Find a single related with a artistId
exports.findOne = (req, res) => {
  const query = related.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(related.collection);
  query
    .where({ Sid: req.params.id })
    .then(related => {
      if (!related) {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      res.send(related);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving related with id " + req.params.artistId
      });
    });
};

exports.findName = (req, res) => {
  const query = related.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(related.collection);
  query
    .where({ Name: req.params.name })
    .then(related => {
      if (!related) {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      res.send(related);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving related with id " + req.params.artistId
      });
    });
};

// Find all related by an artist that match a string
exports.findMatch = (req, res) => {
  const query = related.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(related.collection);
  var regex = new RegExp(req.params.name, "i");
  query
    .where({ Name: regex })
    .then(related => {
      if (!related) {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      res.send(related);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error retrieving related with id " + req.params.artistId
      });
    });
};

// Find all related by an artist that match all parameters
// TODO: pull specific related from the related array as one of the params so in other words be able to search by related title
exports.findMultipleParams = (req, res) => {
  const aggregate = createAggregateQuery(req.params.params);

  related
    .aggregate([
      {
        $match: aggregate
      }
    ])
    .then(related => {
      if (!related) {
        return res.status(404).send({
          message: "related not found with id " + req.params.params
        });
      }
      const str = req.params.params.split("~")[1] || req.params.params;
      const params = str.split("_");
      const relatedParams = params.filter(param => {
        return param.indexOf(".") > -1;
      });

      let relatedArr = related[0].related;
      for (var x = 0; x < relatedParams.length; x++) {
        const param = relatedParams[x];
        const splitter = param.split(":");
        const key = splitter[0].split(".")[1] || splitter[0];
        const val = splitter[1];
        relatedArr = filterArr(relatedArr, key, val);
      }
      related[0].related = relatedArr;

      res.send(related[0]);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "related not found with id " + req.params.params
        });
      }
      return res.status(500).send({
        message: "Error retrieving related with id " + req.params.params
      });
    });
};

// Find related by artists from lat and lng
exports.findLatLng = (req, res) => {
  const params = req.params.params;
  const latLngArr = params.split("_");
  const lowerLat = parseFloat(latLngArr[0]) - 0.05;
  const upperLat = parseFloat(latLngArr[0]) + 0.05;
  const lowerLng = parseFloat(latLngArr[1]) - 0.05;
  const upperLng = parseFloat(latLngArr[1]) + 0.05;

  const query = related.find(); // `query` is an instance of `Query`
  query.setOptions({ lean: true });
  query.collection(related.collection);
  query
    .and([
      { Lat: { $gte: lowerLat } },
      { Lat: { $lte: upperLat } },
      { Lng: { $gte: lowerLng } },
      { Lng: { $lte: upperLng } }
    ])
    .then(related => {
      if (!related) {
        return res.status(404).send({
          message: "related not found with id " + req.params.params
        });
      }
      res.send(related);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "related not found with id " + req.params.params
        });
      }
      return res.status(500).send({
        message: "Error retrieving related with id " + req.params.params
      });
    });
};

// Update a related identified by the artistId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "related content can not be empty"
    });
  }

  // Find related and update it with the request body
  related
    .findByIdAndUpdate(
      req.params.artistId,
      {
        title: req.body.title || "Untitled related",
        content: req.body.content
      },
      { new: true }
    )
    .then(related => {
      if (!related) {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      res.send(related);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Error updating related with id " + req.params.artistId
      });
    });
};

// Delete a related with the specified artistId in the request
exports.delete = (req, res) => {
  related
    .findByIdAndRemove(req.params.artistId)
    .then(related => {
      if (!related) {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      res.send({ message: "related deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "related not found with id " + req.params.artistId
        });
      }
      return res.status(500).send({
        message: "Could not delete related with id " + req.params.artistId
      });
    });
};
