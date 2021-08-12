const { DataTypes } = require("sequelize");

module.exports =(sequelize, DataTypes) => {
    const Owner = sequelize.define('owner', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },        
        userId: {
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

        ownerdescription: {
            type: DataTypes.TEXT(500),
            allowNull: false
        },

        ssn: {
            type: DataTypes.STRING,
            allowNull: false
        },

        selectedImage: {
            type: DataTypes.STRING,
            allowNull: false
        }

    });
    return Owner;
};