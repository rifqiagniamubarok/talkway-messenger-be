const Joi = require('joi');
const { Contact, User, Room_Chat_Member, Room_Chat, Chat, sequelize } = require('../../models');
const generateUniqueCode = require('../../utils/generateUniqueCode');
const { handleRespon } = require('../../utils/respond');
const { Op } = require('sequelize');

const startMessageValidation = Joi.object({
  user_id: Joi.number().required(),
  message: Joi.string().required(),
});

const startMessage = async (req, res) => {
  try {
    const {
      error,
      value: { user_id, message },
    } = startMessageValidation.validate(req.body);
    if (error) throw { message: error.message, error_code: 400 };

    if (user_id === req.user_id) throw { message: 'this user is you', error_code: 400 };
    await sequelize.transaction(async (t) => {
      const checkUser = await User.findOne({ where: { id: user_id }, transaction: t });
      if (!checkUser) throw { message: 'User not found', error_code: 404 };

      const checkContactUser = await Contact.findOne({ where: { user_id: req.user_id, user_saved: user_id } });
      const checkContactUserTarget = await Contact.findOne({ where: { user_id, user_saved: req.user_id } });

      if (checkContactUser || checkContactUserTarget) throw { message: 'this user is already in your contact', error_code: 400 };
      // Create room
      const newRoomPayload = {
        code: generateUniqueCode(10),
        private: true,
      };
      const newRoomChat = await Room_Chat.create(newRoomPayload, { returning: true, transaction: t });

      // Create room member
      const newRoomMemberPayload = [
        { room_chat_id: newRoomChat.id, user_id: req.user_id },
        { room_chat_id: newRoomChat.id, user_id },
      ];
      await Room_Chat_Member.bulkCreate(newRoomMemberPayload, { transaction: t });

      // Create contact
      const newContactPayloads = [
        {
          user_id,
          user_saved: req.user_id,
          name: req.name,
          room_chat_id: newRoomChat.id,
          last_message: message,
          unread: 1,
        },
        {
          user_id: req.user_id,
          user_saved: user_id,
          name: checkUser.name,
          room_chat_id: newRoomChat.id,
          last_message: message,
          unread: 0,
        },
      ];
      await Contact.bulkCreate(newContactPayloads, { transaction: t });

      // Create Chat
      const chatPayload = {
        room_chat_id: newRoomChat.id,
        sender: req.user_id,
        message,
      };
      await Chat.create(chatPayload, { transaction: t, returning: true });

      return res.status(200).json(handleRespon(200, 'ok', { user_id, name: checkUser.name, message, unread: 0 }));
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const joinMessage = async (req, res) => {
  const { room_chat_id } = req.params;
  try {
    await sequelize.transaction(async (t) => {
      await Chat.update({ status: 'read' }, { where: { room_chat_id, sender: { [Op.ne]: req.user_id } }, transaction: t });
      const messages = await Chat.findAll({ where: { room_chat_id }, transaction: t, order: [['createdAt', 'asc']] });
      const contact = await Contact.findOne({ where: { room_chat_id, user_id: req.user_id }, transaction: t });
      contact.unread = 0;
      await contact.save({ transaction: t });
      const response = messages.map(({ dataValues }) => {
        return { ...dataValues, isSender: req.user_id === dataValues.sender };
      });
      return res.status(200).json(handleRespon(200, 'ok', { contact, data: response }));
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const sendMessageValidation = Joi.object({
  message: Joi.string().required(),
});

const sendMessage = async (req, res) => {
  const { room_chat_id } = req.params;
  try {
    const {
      error,
      value: { message },
    } = sendMessageValidation.validate(req.body);
    if (error) throw { message: error.message, error_code: 400 };

    await sequelize.transaction(async (t) => {
      await Chat.update({ status: 'read' }, { where: { room_chat_id, sender: { [Op.ne]: req.user_id } }, transaction: t });
      const newMessage = await Chat.create({ room_chat_id, sender: req.user_id, message }, { transaction: t });
      const contact = await Contact.findOne({ where: { room_chat_id, user_id: req.user_id }, transaction: t });
      contact.last_message = message;
      const targetContact = await Contact.findOne({ where: { room_chat_id, user_id: contact.user_saved }, transaction: t });
      targetContact.last_message = message;
      targetContact.unread += 1;
      await contact.save({ transaction: t });
      await targetContact.save({ transaction: t });

      return res.status(200).json(handleRespon(200, 'ok', newMessage));
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = { startMessage, joinMessage, sendMessage };
