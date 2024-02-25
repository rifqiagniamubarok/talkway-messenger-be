const { Contact, User, sequelize } = require('../../models');
const { handleRespon } = require('../../utils/respond');

const findNumber = async (req, res) => {
  const { phone_number } = req.params;
  try {
    await sequelize.transaction(async (t) => {
      const user = await User.findOne({ where: { phone_number } });
      const contact = await Contact.findOne({ where: { user_id: req.user_id, user_saved: user.id } });
      if (contact) throw { message: 'This user already in your contact', error_code: 400 };
      return res.status(200).json(handleRespon(200, 'ok', { name: user.name, user_id: user.id, about: user.about, phone_number }));
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
const getMessages = async (req, res) => {
  try {
    const contacs = await Contact.findAll({
      where: {
        user_id: req.user_id,
      },
      order: [['updatedAt', 'DESC']],
    });
    res.status(200).json(handleRespon(200, 'ok', { data: contacs }));
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { findNumber, getMessages };
