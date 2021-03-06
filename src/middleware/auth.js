const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const { userId } = decodedToken;
    const { adminId } = decodedToken;
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error({ error: 'Invalid Id' });
    } else if (req.body.adminId && req.body.adminId !== adminId) {
      throw new Error({ error: 'Invalid Id' });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
