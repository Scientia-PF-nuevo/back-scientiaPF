const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define('review', {
		comments: {
			type: DataTypes.STRING,
			// allowNull: false,
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
           
		},
	})
}