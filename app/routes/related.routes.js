module.exports = (app) => {
    const related = require('../controllers/related.controller.js');

    // Create a new related artists
    app.post('/related', related.create);

    // Retrieve all related artists
    app.get('/related', related.findAll);

    // Retrieve a related artists record track with artistId
    app.get('/related/:artistId', related.findOne);

    // Update a related artist  record with artistId
    app.put('/related/:artistId', related.update);

    // Delete a related artist record with artistId
    app.delete('/related/:artistId', related.delete);
}