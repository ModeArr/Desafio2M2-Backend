const { Router } = require("express");
const DBUserManager = require("../dao/DBUserManager");
const userManager = new DBUserManager()

const router = Router();

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (!error) return res.redirect('../../login')
    return res.send({ message: "Logout Error", body: err });
  });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const session = req.session;

    userManager.checkUser(email, password)
    .then((result) => {
      console.log(result)
      console.log(session)
      session.user = {...result};
      res.redirect('../../products')
      console.log(session)
    })
    .catch((error) => {
      res.status(400).json(error.message)
    })
});

router.post("/register", (req, res) => {

    console.log("BODY REGISTER***", req.body);
    const newUser = req.body;

    console.log(newUser)

    userManager.addUser(
      newUser.first_name,
      newUser.last_name,
      newUser.email,
      newUser.password,
    ).then((result) => {
      console.log(result)
      req.session.user = { 
        ...result
       }
      return res.redirect("/login")
    })
    .catch((error) => {
      res.status(400).json(error.message)
    })
  });

module.exports = router;