const OwnerModel = require('./owner.model');
const crypto = require('crypto');
const fs = require ('fs');

exports.insert = ((req, res) => {
   
    OwnerModel.createOwner(req.body).then((result) => {
        res.status(201).send(result);
    }, err => {
        res.status(406).send(err);
    });
}); 

exports.findOwnerById = (req, res) => {
   
    OwnerModel.findOwnerById(req.params.ownerId).then((result) => {
        res.status(200).send(result);
    }, err => {
        const errstatus = err.status || 500
        const errmsg = err.msg || "Error : Cannot retrieve"
        res.status(errstatus).send(errmsg);
        
    });
};


exports.updateOwnerById = ((req, res) => {
    OwnerModel.updateOwnerById(req.body, req.params.ownerId)
    .then((result) => {
        res.status(200).send(result);
    }, err => {
        res.status(406).send(err);
    });
});

exports.deleteOwnerById = (req, res) => {
    let id = req.params.ownerId;
    OwnerModel.deleteOwnerById(id)
        .then((r)=> {
            res.status(200).send(r);
        }, err1 => {
            res.status(406).send(err1);
        });
};

exports.findAllOwner = (req, res) => {
    OwnerModel.findAllOwner().then((result)=> {
            res.status(200).send(result);
        }, err => {
            res.status(406).send(err);
        });
};
