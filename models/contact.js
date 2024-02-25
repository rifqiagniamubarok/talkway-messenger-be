'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contact.init(
    {
      user_id: DataTypes.INTEGER,
      user_saved: DataTypes.INTEGER,
      room_chat_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      last_message: DataTypes.TEXT,
      unread: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'Contact',
    }
  );
  return Contact;
};
