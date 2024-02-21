'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room_Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room_Chat.init({
    code: DataTypes.STRING,
    private: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Room_Chat',
  });
  return Room_Chat;
};