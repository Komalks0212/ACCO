const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const env = require('./configs/env');
const Student = require('./libs/student/student.route');
const Owner = require('./libs/owner/owner.route');
const property = require('./libs/property/property.route');
//const { json } = require('sequelize');
const port = process.env.port || 3000
//const port = 3000;

//app.use(function (re, res, next) {
  //      res.header('Access-Control-Allow-Origin', '*');
    //    res.header('Access-Control-Allow-Credentials', 'true');
      //  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        //res.header('Access-Control-Expose-Headers', 'Content-Length');
        //res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-type, X-Requested-With, Range');
        //if (re.method === 'OPTIONS') {
        //    return res.send(200);
        //} else {
        //    return next();
        //}
    //});

app.use(bodyParser.json());


// app.use('/uploads/student-images', express.static('uploads/student-images'));
Student.studentRoutes(app);
Owner.ownerRoutes(app);
property.propertyRoutes(app);

app.listen(port, function () {
    console.log('app listening on port %s', port);
});