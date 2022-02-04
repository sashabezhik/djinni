const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Mailing extends Model {
    static associate({ User }) {
      Mailing.belongsTo(User, { foreignKey: 'userId' })
    }
  }

  Mailing.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'loading'),
      defaultValue: "active",
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Mailing',
    tableName: 'mailings',
    timestamps: false
  })

  return Mailing
}