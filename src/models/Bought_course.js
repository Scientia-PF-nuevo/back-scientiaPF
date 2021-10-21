const { DataTypes } = require('sequelize')
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define('bought_course', {
		courseId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		state: {
			type: DataTypes.ENUM('completed', 'started', 'bought' ),
			defaultValue: 'bought'
		},
		timeWatched:{
			type:DataTypes.INTEGER,
			defaultValue:0
		},
		lenghtVideo:{
			type:DataTypes.INTEGER,
			defaultValue:0
		},
		owner: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false
		},

	})
}
