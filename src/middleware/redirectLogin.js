

const redirectLogin = (req, res, next) => {
    if(!req.session.userId) {
      res.send("Need loggin");
    } else {
      next();
    }
  }

  module.exports = redirectLogin;