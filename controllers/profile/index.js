const getProfile = async (req, res) => {
  try {
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const editName = async (req, res) => {
  try {
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const editAbout = async (req, res) => {
  try {
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { getProfile, editName, editAbout };
