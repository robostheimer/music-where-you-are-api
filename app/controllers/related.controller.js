const related = require('../models/related.model.js');

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
        spotify: req.body.spotify | {},
    });

    // Save related in the database
    related.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the related."
            });
        });
};

// Retrieve and return all related from the database.
exports.findAll = (req, res) => {
    related.find()
        .then(related => {
            res.send(related);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving related."
            });
        });
};

// Find a single related with a artistId
exports.findOne = (req, res) => {
    related.findById(req.params.artistId)
        .then(related => {
            if (!related) {
                return res.status(404).send({
                    message: "related not found with id " + req.params.artistId
                });
            }
            res.send(related);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "related not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Error retrieving related with id " + req.params.artistId
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
    related.findByIdAndUpdate(req.params.artistId, {
        title: req.body.title || "Untitled related",
        content: req.body.content
    }, { new: true })
        .then(related => {
            if (!related) {
                return res.status(404).send({
                    message: "related not found with id " + req.params.artistId
                });
            }
            res.send(related);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
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
    related.findByIdAndRemove(req.params.artistId)
        .then(related => {
            if (!related) {
                return res.status(404).send({
                    message: "related not found with id " + req.params.artistId
                });
            }
            res.send({ message: "related deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "related not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Could not delete related with id " + req.params.artistId
            });
        });
};