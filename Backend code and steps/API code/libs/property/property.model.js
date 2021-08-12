const Sequelize = require('sequelize');
//const multer = require('multer'); 


const sequelize = require('../../configs/connection');
const Property = require('../../models/property')(sequelize, Sequelize);

Property.sync();
// exports.uploadPropertyImage = multer({
//     storage: multer.diskStorage({
//         destination: function(req, file, callback){
//             callback(null, 'uploads/property-images/')
//         },
//         filename: function (req, file, callback) {
//             callback(null, file.originalname);
//         }
//     })
// }).single('propertyImg'); 
exports.insertProperty = (propertyData) => {
    console.log("Inside the insertProperty function in property model")
    console.log('propertyData---------->:: ',propertyData);
    return new Promise((resolve, reject)=>{
        Property.create(propertyData).then(property=>{
            resolve(property);
        }, err=>{
            reject({error:err});
        });
    });
};
exports.findPropertyById = (id) => {
    return new Promise((resolve, reject)=>{
        Property.findByPk(id).then(property=>{ //findBypk look into it
            if(property == null){
                reject({status:404,message:"Property not found"});
            }
            resolve(property);
        }, err=>{
            reject({error:err});
        });
    });

};

exports.updatePropertyById = (propertyData, id) => {
    return new Promise((resolve, reject)=>{
        Property.update(propertyData, {
            where: {
                pid : id
            }
        }).then(property=>{
            Property.findByPk(id).then(property => {
                resolve(property);
        }, err1=>{
            reject({error:err1});
        })
        }, err1=>{
            reject({error:err});
        });
    });

};
exports.deletePropertyById = (id) => {
    return new Promise((resolve, reject)=>{
        Property.destroy({
            where: {
                pid : id
            }
        }).then(()=>{
            resolve({message:"Property deleted successfully"});
        }, err=>{
            reject({error:err});
        });
    });
};
exports.findAllProperty = () => {
    console.log("Inside the findAllProperty model")
    return new Promise((resolve, reject)=>{
        Property.findAll().then(property=>{
            resolve(property);
        }, err=>{
            reject({error:err});
        });
    });
};