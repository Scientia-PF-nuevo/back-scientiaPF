const { DataTypes } = require('sequelize')
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define('user', {
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
			primaryKey:true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			defaultValue: '',
		},
		phone: {
			type: DataTypes.STRING,
			defaultValue: '',
		},
		city: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		province: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		postalcode: {
			type: DataTypes.STRING,
			defaultValue: ''
		},	
		country: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		isLoggin:{
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		}

	})
}