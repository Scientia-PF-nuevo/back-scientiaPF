const sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
module.exports = (sequelize)=> {
    sequelize.define('category',{
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING
        }
    })
}