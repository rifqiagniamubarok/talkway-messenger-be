const getExample = (req, res) => {
  res.json({ example: true });
};

const getDetailExample = (req, res) => {
  const { param } = req.params;
  res.json({ example: true, param });
};

const createExample = (req, res) => {
  res.json({ example: true });
};

const editExample = (req, res) => {
  const { param } = req.params;
  res.json({ example: true, param });
};

const deleteExample = (req, res) => {
  const { param } = req.params;
  res.json({ example: true, param });
};

module.exports = { getExample, getDetailExample, createExample, editExample, deleteExample };
