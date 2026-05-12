'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association 
      Item.hasMany(models.Loan, {
        foreignKey: "item_id",
      });
    }
  }
  Item.init({
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    image: {
      type: DataTypes.STRING,

      get() {
        let imageName = this.getDataValue('image');
        return `http://localhost:3000/uploads/${imageName}`
      }
    }
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};