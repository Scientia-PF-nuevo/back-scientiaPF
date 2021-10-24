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
    urlVideo: {
      type: DataTypes.TEXT,
      allowNull: true,
      defultValue:''
    },
    urlPdf:{
      type: DataTypes.TEXT,
      allowNull: true,
      defultValue:''
    },
    email:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
    languaje:{
      type: DataTypes.TEXT,
      default :"",
      allowNull: true,
    },
    level:{
      type: DataTypes.TEXT,
      allowNull: true,
      default :"",
    }
  });
};
