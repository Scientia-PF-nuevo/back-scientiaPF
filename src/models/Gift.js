const { DataTypes } = require('sequelize')
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define('gift', {
		courseId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		coupon: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		state: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		giftEmail:{
			type: DataTypes.STRING,
			allowNull: false
		},
		payerEmail:{
			type: DataTypes.STRING,
			allowNull: false

		}
		
	})
}
