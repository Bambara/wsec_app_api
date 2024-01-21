var jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      stores: user.stores,
    },
    "8798761",
    {
      expiresIn: '30d',
    }
  );
};

module.exports = generateToken;
