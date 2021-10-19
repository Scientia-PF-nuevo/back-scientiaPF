const { DataTypes } = require('sequelize')
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define('add_purchase', {
		course: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		state: {
			type: DataTypes.ENUM('completed', 'in progress'),
			default: 'in progress'
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
