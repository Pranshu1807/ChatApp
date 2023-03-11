const { registerUser, loginUser } = require("../controller/userController");
const router = require("express").Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
module.exports = router;
