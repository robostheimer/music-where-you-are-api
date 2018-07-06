const artist = require('../models/artist.model.js');
const { createQuery } = require('../helpers/helpers')

// Create and Save a new artist
exports.create = (req, res) => {
    // Validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "artist content can not be empty"
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
    artist.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the artist."
            });
        });
};

// Retrieve and return all artists from the database.
exports.findAll = (req, res) => {
    artist.find()
        .then(artists => {
            res.send(artists);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving artists."
            });
        });
};

// Find a single artist by Name
exports.findName = (req, res) => {
    console.log(req.params.name)
    const query = artist.find(); // `query` is an instance of `Query`
    query.setOptions({ lean: true });
    query.collection(artist.collection);
    query.where({ 'Name': req.params.name  })
        .then(artist => {
            if (!artist) {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            res.send(artist);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Error retrieving artist with id " + req.params.artistId
            });
        });
};

// Find all artist that match a string
exports.findMatch = (req, res) => {
    console.log(req.params.name)
    const query = artist.find(); // `query` is an instance of `Query`
    query.setOptions({ lean: true });
    query.collection(artist.collection);
    var regex = new RegExp(req.params.name, 'i');
    query.where({ 'Name': regex })
        .then(artist => {
            if (!artist) {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            res.send(artist);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Error retrieving artist with id " + req.params.artistId
            });
        });
};

// Find all artist that match all parameters
exports.findMultipleParams = (req, res) => {
    const conj = req.params.params.split('~')[0];
    const params = req.params.params.split('~')[1].split('_');
    console.log('params', params)
    var arr = createQuery(params)
    console.log('arr', arr)
    const query = artist.find(); // `query` is an instance of `Query`
    

    query.setOptions({ lean: true });
    query.collection(artist.collection);
    query[conj](arr)
        .then(artist => {
            if (!artist) {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.params
                });
            }
            res.send(artist);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.params
                });
            }
            return res.status(500).send({
                message: "Error retrieving artist with id " + req.params.params
            });
        });
};

// Find artists from lat and lng
exports.findLatLng = (req, res) => {
    const params = req.params.params
    const latLngArr = params.split('_');
    const lowerLat = parseFloat(latLngArr[0])-.05;
    const upperLat = parseFloat(latLngArr[0])+.05
    const lowerLng = parseFloat(latLngArr[1])-.05;
    const upperLng = parseFloat(latLngArr[1])+.05;
    
    console.log(lowerLat, upperLat, lowerLng, upperLng)
    const query = artist.find(); // `query` is an instance of `Query`
    query.setOptions({ lean: true });
    query.collection(artist.collection);
    //MyModel.find({ name: 'john', age: { $gte: 18 } });
    //{ $and: [{ "Lat": { $lte: NumberInt(34) } }, { "Lat": { $gte: NumberInt(33) } }, { "Lng": { $lte: NumberInt(-82) } }, { "Lng": { $gte: NumberInt(-83) } }] }
    query.and([{ 'Lat': { $gte: lowerLat } }, { 'Lat': { $lte: upperLat } }, { 'Lng': { $gte: lowerLng } }, { 'Lng': { $lte: upperLng } }])
        .then(artist => {
            if (!artist) {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.params
                });
            }
            res.send(artist);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.params
                });
            }
            return res.status(500).send({
                message: "Error retrieving artist with id " + req.params.params
            });
        });
};

// Find a single artist with a artistId
exports.findOne = (req, res) => {
    //console.log(req.params)
    const query = artist.find(); // `query` is an instance of `Query`
    query.setOptions({ lean: true });
    query.collection(artist.collection);
    query.where({'Sid': req.params.artistId})
        .then(artist => {
            if (!artist) {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            res.send(artist);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Error retrieving artist with id " + req.params.artistId
            });
        });
};

// Update a artist identified by the artistId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "artist content can not be empty"
        });
    }

    // Find artist and update it with the request body
    artist.findByIdAndUpdate(req.params.artistId, {
        title: req.body.title || "Untitled artist",
        content: req.body.content
    }, { new: true })
        .then(artist => {
            if (!artist) {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            res.send(artist);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Error updating artist with id " + req.params.artistId
            });
        });
};

// Delete a artist with the specified artistId in the request
exports.delete = (req, res) => {
    artist.findByIdAndRemove(req.params.artistId)
        .then(artist => {
            if (!artist) {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            res.send({ message: "artist deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "artist not found with id " + req.params.artistId
                });
            }
            return res.status(500).send({
                message: "Could not delete artist with id " + req.params.artistId
            });
        });
};
