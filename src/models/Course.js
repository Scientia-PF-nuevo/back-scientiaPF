const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('course', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{ 
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email:{
      type: DataTypes.TEXT,
      allowNull: false,
    },

   
  });
};
