const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  users: { User },
} = require('../../models');
const { HttpError } = require('../../helpers');
const { SECRET_KEY, EXPIRES_TOKEN } = process.env;

module.exports = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'User is not found. Please check email');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email is not verified yet');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, 'Password is incorrect. Please check');
  }

  const token = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: EXPIRES_TOKEN,
  });
  const loggedUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }, // to return upgraded user after searching because Mongoose returns user as he was before the update
  );

  const { balance, username } = loggedUser;
  return res.status(200).json({
    data: {
      username,
      email,
      balance,
      token,
    },
    message: `User by email: ${email} has been logged in`,
  });
};