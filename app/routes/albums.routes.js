module.exports = (app) => {
    const albums = require('../controllers/albums.controller.js');

    // Create a new albums artists
    app.post('/albums', albums.create);

    // Retrieve all albums artists
    app.get('/albums', albums.findAll);

    // Retrieve a albums artists record track with artistId
    app.get('/albums/:artistId', albums.findOne);

    // Update a albums artist  record with artistId
    app.put('/albums/:artistId', albums.update);

    // Delete a albums artist record with artistId
    app.delete('/albums/:artistId', albums.delete);
}