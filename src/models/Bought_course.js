const { DataTypes } = require('sequelize')
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define('bought_course', {
		course: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		state: {
			type: DataTypes.ENUM('completed', 'started'),
			default: 'started'
		},
		owner: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	})
}
