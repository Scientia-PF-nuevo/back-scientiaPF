const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('curso', {
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
    video:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false
    }



  });
};
