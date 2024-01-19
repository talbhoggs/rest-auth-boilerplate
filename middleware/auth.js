const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      const err = new Error('Access Denied');
      err.statusCode = 403;
      throw err;
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userinfo = decodedToken.UserInfo;
    next();
  } catch (err) {
    res.status(err.statusCode || 500).json({
      successful: false,
      error: err.message,
      timestamp: Date.now(),
      status: err.statusCode || 500,
    });
  }
};

module.exports = verifyToken;
