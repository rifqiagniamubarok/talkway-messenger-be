'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chat.init(
    {
      room_chat_id: DataTypes.INTEGER,
      sender: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      status: { type: DataTypes.STRING, defaultValue: 'sending' },
      is_delete: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Chat',
    }
  );
  return Chat;
};
