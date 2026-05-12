'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Item.hasMany(models.Loan, {
      //   foreignKey:"item_id"
      // });
      Loan.belongsTo(models.Item, {
        foreignKey: "item_id"
      });
      Loan.hasOne(models.Return, {
        foreignKey:'loan_id'
      })
    }
  }
  Loan.init({
    name: DataTypes.STRING,
    item_id: DataTypes.INTEGER,
    total_item: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Loan',
  });
  return Loan;
};