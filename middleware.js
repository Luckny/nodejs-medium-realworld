const jwt = require('jsonwebtoken');

module.exports.verifyToken = async (req, res, next) => {
   //I need to get the user id from the  token
   const token = req.headers.authorization.split(' ')[1];
   //verifying the token will return the payload
   const payload = jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      //if a token error
      if (err) {
         next(err);
      }
      //if valid
      return payload;
   });

   req.tokenAndPayload = { token, payload };
   next();
};
