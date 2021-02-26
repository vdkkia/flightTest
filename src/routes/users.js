const express = require("express");
const router = express.Router();
const passport = require("../middlewares/passport");
const userController = require("../controllers/userController");

// TO-DO: Use JOI to validate req.body
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    await userController.register(username, password);
    return res.status(200).json({ message: "Registration was successful!" });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: "An error occurred when logging you in." });
    }
    req.logIn(user, (e) => {
      if (e) {
        return res.status(400).json({ message: "An error occurred when logging you in." });
      }
    });
    res.status(200).json({ massage: "user logged in" });
  })(req, res, next);
});

module.exports = router;
