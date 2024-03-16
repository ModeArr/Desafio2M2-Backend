const { Router } = require("express");
const passport = require("passport");

const router = Router();

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (!error) return res.redirect('../../login')
    return res.send({ message: "Logout Error", body: err });
  });
});

router.post("/login", passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post("/register", passport.authenticate('register', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

module.exports = router;