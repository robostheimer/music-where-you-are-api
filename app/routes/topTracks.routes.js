module.exports = (app) => {
    const topTracks = require('../controllers/topTracks.controller.js');

    // Create a new topTracks
    app.post('/topTracks', topTracks.create);

    // Retrieve all topTracks
    app.get('/topTracks', topTracks.findAll);

    // Retrieve a single track with artistId
    app.get('/topTracks/:artistId', topTracks.findOne);

    // Update a topTrack with artistId
    app.put('/topTracks/:artistId', topTracks.update);

    // Delete a topTrack with artistId
    app.delete('/topTracks/:artistId', topTracks.delete);
}