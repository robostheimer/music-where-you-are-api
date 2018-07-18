const albums = require('../models/albums.model.js');
const { createAggregateQuery, filterArr } = require('../helpers/helpers');

// Create and Save a new albums
exports.create = (req, res) => {
    // Validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "albums content can not be empty"
        });
    }

    // Create a albums
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

// Find by albums by an artist  with a artistId
exports.findOne = (req, res) => {
    const query = albums.find(); // `query` is an instance of `Query`
    query.setOptions({ lean: true });
    query.collection(albums.collection);
    query.where({ 'Sid': req.params.id })
        .then(albums => {
            if (!albums) {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.id
                });
            }
            res.send(albums);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving albums with id " + req.params.id
            });
        });
};

// Find albums by a single artists
exports.findName = (req, res) => {
    console.log(req.params.name)
    const query = albums.find(); // `query` is an instance of `Query`
    query.setOptions({ lean: true });
    query.collection(albums.collection);
    query.where({ 'Name': req.params.name })
        .then(albums => {
            if (!albums) {
                return res.status(404).send({
                    message: "albums not found with name: " + req.params.name
                });
            }
            res.send(albums);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "albums not found with name: " + req.params.name
                });
            }
            return res.status(500).send({
                message: "Error retrieving albums with name: " + req.params.name
            });
        });
};

// Find all albums by an artist that match a string
exports.findMatch = (req, res) => {
    console.log(req.params.name)
    const query = albums.find(); // `query` is an instance of `Query`
    query.setOptions({ lean: true });
    query.collection(albums.collection);
    var regex = new RegExp(req.params.name, 'i');
    query.where({ 'Name': regex })
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

exports.findMultipleParams = (req, res) => {
    const aggregate = createAggregateQuery(req.params.params)

    albums.aggregate([{
        $match: aggregate
    }])
    .then(albums => {
        if (!albums) {
            return res.status(404).send({
                message: "albums not found with id " + req.params.params
            });
        }
        const str = req.params.params.split('~')[1] || req.params.params
        const params = str.split('_');
        const albumParams = params.filter(param => {
            return param.indexOf('.') > -1;
        });

        let albumsArr = albums[0].albums;

        for(var x = 0; x < albumParams.length; x++) {
            const param = albumParams[x];
            const splitter = param.split(':');
            const key = splitter[0].split('.')[1] || splitter[0];
            const val = splitter[1];
            albumsArr = filterArr(albumsArr, key, val);
        }
        albums[0].albums = albumsArr;
        res.send(albums[0]);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "albums not found with id " + req.params.params
            });
        }
        return res.status(500).send({
            message: "Error retrieving albums with id " + req.params.params
        });
    });
};


// Find albums by artists from lat and lng
exports.findLatLng = (req, res) => {
    const params = req.params.params
    const latLngArr = params.split('_');
    const lowerLat = parseFloat(latLngArr[0]) - .05;
    const upperLat = parseFloat(latLngArr[0]) + .05
    const lowerLng = parseFloat(latLngArr[1]) - .05;
    const upperLng = parseFloat(latLngArr[1]) + .05;

    const query = albums.find(); // `query` is an instance of `Query`
    query.setOptions({ lean: true });
    query.collection(albums.collection);
    query.and([{ 'Lat': { $gte: lowerLat } }, { 'Lat': { $lte: upperLat } }, { 'Lng': { $gte: lowerLng } }, { 'Lng': { $lte: upperLng } }])
        .then(albums => {
            if (!albums) {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.params
                });
            }
            res.send(albums);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "albums not found with id " + req.params.params
                });
            }
            return res.status(500).send({
                message: "Error retrieving albums with id " + req.params.params
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

