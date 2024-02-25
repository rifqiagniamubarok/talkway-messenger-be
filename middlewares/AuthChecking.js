const jwt = require('jsonwebtoken');

const AuthChecking = async (token) => {
  try {
    const key = process.env.AUTH_KEY;
    const decodeData = jwt.verify(token, key);

    return { data: decodeData };
  } catch (error) {
    return { error };
  }
};

module.exports = AuthChecking;
