const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs/promises');
const { users, setUsers } = require('../service/userService');
require('dotenv').config();

const signUp = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and Password is required',
      timestamp: Date.now(),
      status: 400,
    });
  }

  // check for duplicate
  const duplicate = users.find((user) => user.username === req.body.username);

  if (duplicate) {
    return res.status(400).json({
      error: `Username ${req.body.username} is already taken`,
      timestamp: Date.now(),
      status: 400,
    });
  }

  const newUser = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    roles: { User: 2001 },
  };

  const updatedUsers = [...users, newUser];
  // save

  setUsers(updatedUsers); // this is not working fix this
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(updatedUsers),
  );

  res.status(201).json({
    successful: true,
    message: 'Created successfully!',
    timestamp: Date.now(),
    status: 201,
    data: newUser,
  });
};

const signIn = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and Password is required',
      timestamp: Date.now(),
      status: 400,
    });
  }

  const existingUser = users.find((user) => user.username === req.body.username);

  if (!existingUser) {
    return res.status(401).json({
      error: 'Invalid Username / password',
      timestamp: Date.now(),
      status: 401,
    });
  }

  const validUser = await bcrypt.compare(
    req.body.password,
    existingUser.password,
  );

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

  res.status(200).json({
    successful: true,
    message: 'User logged in successfully',
    timestamp: Date.now(),
    status: 200,
    data: { ...existingUser, accessToken, refreshToken },
  });
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      successful: true,
      message: 'Token required',
      timestamp: Date.now(),
      status: 400,
    });
  }

  const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const validUser = users.find((user) => user.username === verified.username);

  if (!verified || !validUser) {
    res.status(400).json({
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

  res.status(200).json({
    successful: true,
    timestamp: Date.now(),
    status: 200,
    data: { ...validUser, accessToken, refreshToken },
  });
};

const getUsers = (req, res) => {
  res.status(200).json({
    successful: true,
    timestamp: Date.now(),
    status: 200,
    data: users,
  });
};

module.exports = {
  signUp, signIn, getUsers, refreshToken,
};
