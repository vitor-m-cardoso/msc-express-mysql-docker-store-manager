const validateName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: '"name" is required' });
  }
  next();
};

const validateNameLength = (req, res, next) => {
  const { name } = req.body;
  const minCharacters = 5;

  if (name.length < minCharacters) {
    return res.status(422).json({ message: '"name" length must be at least 5 characters long' });
  }
  next();
};

module.exports = {
  validateName,
  validateNameLength,
};
