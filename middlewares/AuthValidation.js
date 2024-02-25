const jwt = require('jsonwebtoken');

const AuthValidation = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const key = process.env.AUTH_KEY;
    const decodeData = jwt.verify(authHeader, key);
    req.user_id = decodeData.user_id;
    req.name = decodeData.name;
    req.phone_number = decodeData.phone_number;
    next();
  } catch (error) {
    res.json({ error });
  }
};

module.exports = AuthValidation;
