const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define('review', {
		comments: {
			type: DataTypes.TEXT,
			// allowNull: false,
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
           
		},
		commentUser:{
			type: DataTypes.TEXT,
			allowNull: false,
		}
	})
}