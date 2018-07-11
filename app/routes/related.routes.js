module.exports = (app) => {
    const related = require('../controllers/related.controller.js');

    // Create a new related artists
    app.post('/related', related.create);

    // Retrieve all related artists
    app.get('/related', related.findAll);

    // Retrieve a related artists record track with artistId
    app.get('/related/:id', related.findOne);

    // Retrieve related with name
    app.get('/relatedName/:name', related.findName);

    // Retrieve a single that matches a name
    app.get('/relatedMatch/:name', related.findMatch);

    // Retrieve all records that matches all parameters
    app.get('/relatedMultiple/:params', related.findMultipleParams);

    // Retrieve all records that matches all parameters
    app.get('/related/:params', related.findLatLng);

    // Update a related artist  record with artistId
    app.put('/related/:artistId', related.update);

    // Delete a related artist record with artistId
    app.delete('/related/:artistId', related.delete);
}