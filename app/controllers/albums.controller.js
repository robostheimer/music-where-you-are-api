const albums = require('../models/albums.model.js');

// Create and Save a new artist
exports.create = (req, res) => {
    // Validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "artist content can not be empty"
        });
    }

    // Create a artist
    const albums = new albums({
        title: req.body.title || "Untitled albums",
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

    // Save albums in the database
    albums.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the albums."
            });
        });
};

// Retrieve and return all albums from the database.
exports.findAll = (req, res) => {
    albums.find()
        .then(albums => {
            res.send(albums);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving albums."
            });
        });
};

// Find a single albums with a artistId
exports.findOne = (req, res) => {
    albums.findById(req.params.artistId)
        .then(albums => {
            if (!albums) {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.artistId
                });
            }
            res.send(albums);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Error retrieving albums with id " + req.params.artistId
            });
        });
};
// Update a albums identified by the artistId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "albums content can not be empty"
        });
    }

    // Find albums and update it with the request body
    albums.findByIdAndUpdate(req.params.artistId, {
        title: req.body.title || "Untitled albums",
        content: req.body.content
    }, { new: true })
        .then(albums => {
            if (!albums) {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.artistId
                });
            }
            res.send(albums);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Error updating albums with id " + req.params.artistId
            });
        });
};

// Delete a albums with the specified artistId in the request
exports.delete = (req, res) => {
    albums.findByIdAndRemove(req.params.artistId)
        .then(albums => {
            if (!albums) {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.artistId
                });
            }
            res.send({ message: "albums deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Could not delete albums with id " + req.params.artistId
            });
        });
};