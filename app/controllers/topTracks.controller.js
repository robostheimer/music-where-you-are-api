const topTracks = require('../models/topTracks.model.js');

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
        spotify: req.body.spotify | {},
    });

    // Save topTracks in the database
    topTracks.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the topTracks."
            });
        });
};

// Retrieve and return all topTracks from the database.
exports.findAll = (req, res) => {
    topTracks.find()
        .then(topTracks => {
            res.send(topTracks);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving topTracks."
            });
        });
};

// Find a single topTracks with a artistId
exports.findOne = (req, res) => {
    topTracks.findById(req.params.artistId)
        .then(topTracks => {
            if (!topTracks) {
                return res.status(404).send({
                    message: "topTracks not found with id " + req.params.artistId
                });
            }
            res.send(topTracks);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "topTracks not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Error retrieving topTracks with id " + req.params.artistId
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
    topTracks.findByIdAndUpdate(req.params.artistId, {
        title: req.body.title || "Untitled topTracks",
        content: req.body.content
    }, { new: true })
        .then(topTracks => {
            if (!topTracks) {
                return res.status(404).send({
                    message: "topTracks not found with id " + req.params.artistId
                });
            }
            res.send(topTracks);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
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
    topTracks.findByIdAndRemove(req.params.artistId)
        .then(topTracks => {
            if (!topTracks) {
                return res.status(404).send({
                    message: "topTracks not found with id " + req.params.artistId
                });
            }
            res.send({ message: "topTracks deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "topTracks not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Could not delete topTracks with id " + req.params.artistId
            });
        });
};