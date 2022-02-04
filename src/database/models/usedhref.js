const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UsedHref extends Model {}
  
  UsedHref.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UsedHref',
    tableName: 'used_hrefs',
    timestamps: false
  })

  return UsedHref
}