const StudentController = require('./student.controller');
const StudentModel = require('./student.model');

exports.studentRoutes =function (app) {

    app.post('/student', [
        // StudentModel.uploadStudentImage,
        StudentController.insert
    ]);

    app.get('/student/:studentId', [
        StudentController.findStudentById
    ]);

    app.put('/student/:studentId', [
        // StudentModel.uploadStudentImage,
        StudentController.updateStudentById
    ]);

    app.delete('/student/:studentId', [
        StudentController.deleteStudentById
    ]);

    app.get('/student', [
        StudentController.findAllStudent
    ]);

};