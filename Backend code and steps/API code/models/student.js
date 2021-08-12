const { DataTypes } = require("sequelize");

module.exports =(sequelize, DataTypes) => {
    const Student = sequelize.define('student', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },        
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        permanentaddress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        pzipcode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        currentaddress: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        czipcode: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        phone: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        studentdescription: {
            type: DataTypes.TEXT(500),
            allowNull: false
        },

        // imageURL: {
        //    type: DataTypes.BLOB('long'),
        //    allowNull: false
        // }
        selectedDoc: {
            type: DataTypes.STRING,
            allowNull: false
        },

        selectedImage: {
            type: DataTypes.STRING,
            allowNull: false
        }

    });
    return Student;
};