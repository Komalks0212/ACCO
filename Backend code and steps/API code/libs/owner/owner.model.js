const Sequelize = require('sequelize');
// const multer = require('multer'); 

const sequelize = require('../../configs/connection');
//const owner = require('../../models/owner');
const Owner = require('../../models/owner')(sequelize, Sequelize);

Owner.sync();

exports.createOwner = (ownerData) => {
    return new Promise((resolve, reject)=>{
        Owner.create(ownerData).then(owner=>{
            resolve(owner);
        }, err=>{
            reject({error:err});
        });
    });
};
exports.findOwnerById = (id) => {
    return new Promise((resolve, reject)=> {
        Owner.findByPk(id).then(owner=> {
            if(owner == null){
                reject({status:404,message:"owner not found"});
            }
            resolve(owner);
        },err=>{
            
            reject({error:err});
        });
    });

};

exports.updateOwnerById = (ownerData, id) => {
    return new Promise((resolve, reject)=>{
        Owner.update(ownerData, {
            where: {
                userID : id
            }
        }).then(owner=>{
            Owner.findByPk(id).then(owner => {
                resolve(owner);
        }, err1=>{
            reject({error:err1});
        })
        }, err1=>{
            reject({error:err});
        });
    });

};

exports.deleteOwnerById = (id) => {
    return new Promise((resolve, reject)=>{
        Owner.destroy({
            where: {
                userID : id
            }
        }).then(()=>{
            resolve({message:"Deleted Successfully"});
        }, err=>{
            reject({error:err});
        });
    });
};


exports.findAllOwner = () => {
    return new Promise((resolve, reject)=>{
        Owner.findAll().then(owner=>{
            resolve(owner);
        }, err=>{
            reject({error:err});
        });
    });
};
