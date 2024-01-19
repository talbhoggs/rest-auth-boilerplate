const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../model/Users');

const signUp = async (req, res, next) => {
  // code
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and Password is required',
      timestamp: Date.now(),
      status: 400,
    });
  }

  const duplicate = await user.findOne({ username });

  if (duplicate) {
    return res.status(400).json({
      error: `Username ${req.body.username} is already taken`,
      timestamp: Date.now(),
      status: 400,
    });
  }

  const newUser = await user.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  res.status(201).json({
    successful: true,
    message: 'Created successfully!',
    timestamp: Date.now(),
    status: 201,
    data: newUser,
  });
};

const signIn = async (req, res, next) => {
  // code
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and Password is required',
      timestamp: Date.now(),
      status: 400,
    });
  }

  const existingUser = await user.findOne({ username });

  if (!existingUser) {
    return res.status(401).json({
      error: 'Invalid Username / password',
      timestamp: Date.now(),
      status: 401,
    });
  }

  const validUser = bcrypt.compare(req.body.password, existingUser.password);

  if (!validUser) {
    return res.status(401).json({
      error: 'Invalid Username / password',
      timestamp: Date.now(),
      status: 401,
    });
  }

  const roles = Object.values(existingUser.roles);

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: existingUser.username,
        roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' },
  );
  const refreshToken = jwt.sign(
    { username: existingUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' },
  );

  const result = {
    username: existingUser.username,
    roles: existingUser.roles,
    accessToken,
    refreshToken,
  };
  res.status(200).json({
    successful: true,
    message: 'User logged in successfully',
    timestamp: Date.now(),
    status: 200,
    data: result,
  });
};

const refreshToken = (req, res, next) => {
  // code
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      successful: true,
      message: 'Token required',
      timestamp: Date.now(),
      status: 400,
    });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decode) => {
      if (err) {
        return res.status(400).json({
          successful: false,
          message: 'Invalid / expired token',
          timestamp: Date.now(),
          status: 400,
        });
      }
      const validUser = await user.findOne({ username: decode.username });

      if (!validUser) {
        return res.status(400).json({
          successful: false,
          message: 'Invalid / expired token',
          timestamp: Date.now(),
          status: 400,
        });
      }
      const roles = Object.values(validUser.roles);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: validUser.username,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' },
      );

      const result = {
        username: validUser.username,
        roles: validUser.roles,
        accessToken,
        refreshToken,
      };
      res.status(200).json({
        successful: true,
        timestamp: Date.now(),
        status: 200,
        data: result,
      });
    },
  );
};

module.exports = {
  signUp,
  signIn,
  refreshToken,
};
