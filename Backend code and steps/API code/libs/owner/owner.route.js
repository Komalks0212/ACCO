const OwnerController = require('./owner.controller');
const OwnerModel = require('./owner.model');

exports.ownerRoutes =function (app) {

    app.post('/owner', [
        // OwnerModel.uploadStudentImage,
        OwnerController.insert
    ]);

    app.get('/owner/:ownerId', [
        OwnerController.findOwnerById
    ]);

    app.put('/owner/:ownerId', [
        // StudentModel.uploadStudentImage,
        OwnerController.updateOwnerById
    ]);

    app.delete('/owner/:ownerId', [
        OwnerController.deleteOwnerById
    ]);

    app.get('/owner', [
        OwnerController.findAllOwner
    ]);

};