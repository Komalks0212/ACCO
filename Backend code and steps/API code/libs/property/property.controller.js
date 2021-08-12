const PropertyModel = require('./property.model');
const crypto = require('crypto');
const fs = require ('fs');

exports.insertPropertyDetails = ((req, res) => {
    console.log("Inside the insert function")
    //console.log('sdafd>>>>>>>>>>>>>>>>',req.body);
    // req.body.imageURL = `uploads/property-images/${req.file.filename}`;
    PropertyModel.insertProperty(req.body).then((result) => {
        res.status(201).send(result);
    }, err => {
        res.status(406).send(err);
    });
});
exports.findPropertyById = ((req, res) => {
    PropertyModel.findPropertyById(req.params.propertyId.substring(1))
    .then((result) => {
        res.status(200).send(result);
    }, err => {
        res.status(err.status).send(err.message);
    });
});
exports.updatePropertyById = ((req, res) => {
    // console.log("lets view the data in update module:",req.body, req.params.propertyId.substring(1))
    // console.log("lets view the id in update module:",req.params.propertyId.substring(1))
    // console.log("id without substring here:",req.params.propertyId.substring)
    PropertyModel.updatePropertyById(req.body, req.params.propertyId.substring(1))
    .then((result) => {
        res.status(200).send(result);
    }, err => {
        res.status(406).send(err);
    });
});
exports.deletePropertyById = (req, res) => {
    let id = req.params.propertyId;
    PropertyModel.deletePropertyById(id.substring(1))
        .then((r)=> {
            res.status(200).send(r);
        }, err1 => {
            res.status(406).send(err1);
        });
};
exports.findAllProperty = (req, res) => {
    console.log("inside the get all property module")
    PropertyModel.findAllProperty()
        .then((result)=> {
            res.status(200).send(result);
        }, err => {
            res.status(406).send(err);
        });
};