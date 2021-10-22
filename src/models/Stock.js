const { DataTypes } = require('sequelize')

	// defino el modelo
	module.exports = (sequelize) => {
	sequelize.define('stock', {
		active: {
			type: DataTypes.ENUM('true', 'false'),
			defaultValue: 'false'
		},
        amount: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
		percentage: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
	})
}

