const { DataTypes } = require("sequelize");

module.exports =(sequelize, DataTypes) => {
    const Property = sequelize.define('property', {
	    pid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        add: {
            type: DataTypes.STRING,
            allowNull: false
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
		available_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
		desc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ownerEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ownerId: {
            type: DataTypes.STRING,
            allowNull: false, //is a foreign key
            // references: {
            //     model: 'owners',
            //     key: 'ownerId'        //Owner.hasMany(Property)
            // }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        zipcode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false
        },

        imageURL: {
            //type: DataTypes.BLOB('long'),
            type: DataTypes.STRING,
            allowNull: false
        }

    });
    return Property;
    
};

//Property.belongsTo('Owner');