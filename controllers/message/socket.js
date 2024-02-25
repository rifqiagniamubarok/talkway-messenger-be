const { Chat, Contact, sequelize } = require('../../models');
const AuthChecking = require('../../middlewares/AuthChecking');

const processMessage = async (socket, load) => {
  try {
    const { data: dataLoad, token } = load;
    const { error, data: decodeUser } = await AuthChecking(token);
    if (error) throw 'error';
    await sequelize.transaction(async (t) => {
      const payload = {
        room_chat_id: dataLoad.room_chat_id,
        sender: decodeUser.user_id,
        message: dataLoad.message,
        status: 'sent',
      };
      const chat = await Chat.create(payload, { returning: true });
      // Contact
      const contact = await Contact.findOne({ where: { room_chat_id: dataLoad.room_chat_id, user_id: decodeUser.user_id } });
      contact.last_message = dataLoad.message;
      await contact.save();
      // Contact Target
      const contactTarget = await Contact.findOne({ where: { room_chat_id: dataLoad.room_chat_id, user_id: contact.user_saved } });
      contactTarget.last_message = dataLoad.message;
      contactTarget.unread += 1;
      await contactTarget.save();

      // socket.emit('receive_message', { ...chat.dataValues, isSender: true });
      socket.to(dataLoad.room_chat_id).emit('receive_message', { ...chat.dataValues, isSender: false });
    });
  } catch (error) {
    return error;
  }
};

module.exports = { processMessage };
