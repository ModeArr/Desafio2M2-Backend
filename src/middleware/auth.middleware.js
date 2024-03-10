function authMdw(req, res, next) {
    if (req.session?.user) {
      return next();
    }
  
    return res.redirect("/login");
  }

  function loggedRedirect(req, res, next) {
    if (req.session?.user) {
      return res.redirect("/")
    }
  
    return next()
  }
  
  module.exports = { authMdw,
     loggedRedirect
    }