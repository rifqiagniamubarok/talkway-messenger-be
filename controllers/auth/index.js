const Joi = require('joi');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const { handleRespon } = require('../../utils/respond');
const jwt = require('jsonwebtoken');

const loginValidation = Joi.object({
  phone_number: Joi.number().required(),
  password: Joi.string().required(),
});

const login = async (req, res) => {
  try {
    const {
      error,
      value: { phone_number, password },
    } = loginValidation.validate(req.body);
    if (error) throw { message: error.message, error_code: 400 };

    const user = await User.findOne({ where: { phone_number } });
    if (!user) throw { message: 'username or password wrong', code: 400 };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { message: 'username or password wrong', code: 400 };

    const payload = { user_id: user.id, name: user.name, about: user.about, phone_number: phone_number };

    const token = jwt.sign(payload, 'secretKey', { expiresIn: '1d' });
    res.status(200).json(handleRespon(200, 'success', token));
  } catch (error) {
    res.status(500).json({ error });
  }
};
const registerValidation = Joi.object({
  name: Joi.string().required(),
  phone_number: Joi.number().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});

const register = async (req, res) => {
  try {
    const {
      error,
      value: { name, phone_number, password, confirm_password },
    } = registerValidation.validate(req.body);
    if (error) throw { message: error.message, error_code: 400 };
    if (password !== confirm_password) throw { message: 'password not match', error_code: 400 };

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({ name, phone_number, password: hashPassword });

    res.status(200).json(handleRespon(200, 'success', { name, phone_number }));
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { login, register };
