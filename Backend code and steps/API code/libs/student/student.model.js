const Sequelize = require('sequelize');
//const multer = require('multer'); 

const sequelize = require('../../configs/connection');
const Student = require('../../models/student')(sequelize, Sequelize);

Student.sync();

// exports.uploadStudentImage = multer({
//     storage: multer.diskStorage({
//         destination: 'uploads/student-images/',
//         filename: function (req, file, callback) {
//             callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//         }
//     })
// }).single('imageURL'); 

exports.createBusiness = (studentData) => {
    return new Promise((resolve, reject)=>{
        Student.create(studentData).then(student=>{
            resolve(student);
        }, err=>{
            reject({error:err});
        });
    });
};
exports.findStudentById = (id) => {
    return new Promise((resolve, reject)=> {
        Student.findByPk(id).then(student=> {
            if(student == null){
                reject({status:404,message:"Student not found"});
            }
            resolve(student);
        },err=>{
            //console.log("Test");
            reject({error:err});
        });
    });

};

exports.updateStudentById = (studentData, id) => {
    return new Promise((resolve, reject)=>{
        Student.update(studentData, {
            where: {
                userID : id
            }
        }).then(student=>{
            Student.findByPk(id).then(student => {
                resolve(student);
        }, err1=>{
            reject({error:err1});
        })
        }, err1=>{
            reject({error:err});
        });
    });

};

exports.deleteStudentById = (id) => {
    return new Promise((resolve, reject)=>{
        Student.destroy({
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


exports.findAllStudent = () => {
    return new Promise((resolve, reject)=>{
        Student.findAll().then(student=>{
            resolve(student);
        }, err=>{
            reject({error:err});
        });
    });
};
