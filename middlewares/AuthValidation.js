const AuthValidation = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    res.json({ error });
  }
};

module.exports = AuthValidation;
