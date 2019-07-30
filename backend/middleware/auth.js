var jwt  = require('jsonwebtoken');

module.exports = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'this-is-my-secret-i-know-it-should-be-longer');
    req.userData = { userName: decodedToken.userName, id: decodedToken.id }
    next();
  }
  catch(err) {
      res.status(401).json({
        message: 'Auth Failed'
    });
  };
}
