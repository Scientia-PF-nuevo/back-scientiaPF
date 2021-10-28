const { DataTypes } = require('sequelize')

	// defino el modelo
	module.exports = (sequelize) => {
	sequelize.define('stock', {
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
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

