const jwt = require("jsonwebtoken");

const key = "ju4t";

/* Return token payload or false */
module.exports = function authentication(req) {
  if (req) {
    /* Get user token from header */
    let auth = req.headers.authorization;
    let token = "";
    /* Confirm token is enable */
    if (auth.indexOf("Bearer ") > -1) {
      /* Get token without 'Bearer '  */
      token = auth.replace("Bearer ", "");
      try {
        let authResult = jwt.verify(token, key);
        return authResult
      } catch (error) {
        console.log("Token Exception : " + error);
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false
  }
};
