const StudentModel = require('./student.model');
const crypto = require('crypto');
const fs = require ('fs');

exports.insert = ((req, res) => {
    // req.body.imageURL = 'uploads/business-images/${req.file.filename}';
    StudentModel.createBusiness(req.body).then((result) => {
        res.status(201).send(result);
    }, err => {
        res.status(406).send(err);
    });
});

exports.findStudentById = (req, res) => {
    //console.log(req.params.studentId);
    StudentModel.findStudentById(req.params.studentId).then((result) => {
        res.status(200).send(result);
    }, err => {
        const errstatus = err.status || 500
        const errmsg = err.msg || "Error : Cannot retrieve"
        res.status(errstatus).send(errmsg);
        //console.log("%s", req.params.studentId)
    });
};


// exports.updateStudentById = ((req, res) => {
//     if (req.file != undefined) {
//         req.body.imageURL = 'uploads/student-images/${req.file.filename}';
//         let id = req.params.studentId
//         BusinessModel.findStudentById(id).then((result) => {
//                 if (result.imageURL != null) {
//                     fs.unlinkSync(result.imageURL);
//                 }
//                 StudentModel.updateStudentById(req.body, id).then((r) => {
//                         res.status(200).send(r);
//                     }, err1 => {
//                         res.status(406).send(err1);
//                     });
//             }, err => {
//                 res.status(406).send(err);
//             });
//     } else {

//         StudentModel.updateStudentById(req.body, req.params.StudentId)
//         .then((result) => {
//                 res.status(200).send(result);
//         }, err => {
//             res.status(406).send(err);
//         });
//     }
// });

exports.updateStudentById = ((req, res) => {
    StudentModel.updateStudentById(req.body, req.params.studentId)
    .then((result) => {
        res.status(200).send(result);
    }, err => {
        res.status(406).send(err);
    });
});

exports.deleteStudentById = (req, res) => {
    let id = req.params.studentId;
    StudentModel.deleteStudentById(id)
        .then((r)=> {
            res.status(200).send(r);
        }, err1 => {
            res.status(406).send(err1);
        });
};

exports.findAllStudent = (req, res) => {
    StudentModel.findAllStudent().then((result)=> {
            res.status(200).send(result);
        }, err => {
            res.status(406).send(err);
        });
};

