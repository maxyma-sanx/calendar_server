const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  user: { User },
} = require('../../models');
const { SECRET_KEY, EXPIRES_TOKEN } = process.env;

module.exports = {
  auth: passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),

  callback: passport.authenticate('google', {
    failureRedirect: '/api/users/login',
  }),

  successCallback: async (req, res) => {
    const { _id: id } = req.user;

    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_TOKEN });

    const user = await User.findByIdAndUpdate(id, { token });
    const { avatarURL, username, email, birthday, phone, skype } = user;

    // res.redirect(
    //   `https://oleh-kliapko.github.io/GooseTrack_front?token=${token}`,
    // );
    res.redirect(
      `https://oleh-kliapko.github.io/GooseTrack_front/google?token=${token}`,
    );

    // return res.status(200).json({
    //   data: {
    //     avatarURL,
    //     username,
    //     email,
    //     birthday,
    //     phone,
    //     skype,
    //     token,
    //   },
    //   message: `User with email: ${email} has been logged in through Google Auth`,
    //   redirectURL,
    // });
  },
};
