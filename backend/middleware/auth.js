var jwt  = require('jsonwebtoken');

module.exports = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'this-is-my-secret-i-know-it-should-be-longer');
    next();
  }
  catch(err) {
      res.status(401).json({
        message: 'Auth Failed'
    });
  };
}
