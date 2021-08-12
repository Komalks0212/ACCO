const PropertyController = require('./property.controller');
const PropertyModel = require('./property.model')

exports.propertyRoutes =function (app) {
    //app.get('/', (req, res) => res.send('Hello World!!!!!'));
    app.post('/property', [
        //PropertyModel.uploadPropertyImage,
        PropertyController.insertPropertyDetails
    ]);

    app.get('/property:propertyId', [
        PropertyController.findPropertyById
    ]);

    app.put('/property:propertyId', [
        PropertyController.updatePropertyById
    ]);

    app.delete('/property:propertyId', [
        PropertyController.deletePropertyById
    ]);

    app.get('/property', [
        PropertyController.findAllProperty
    ]);

};