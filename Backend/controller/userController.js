const User = require("../models/userModel");
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, picture } = req.body;
    const user = await new User({
      name,
      email,
      password,
      picture,
      status: "online",
    });
    await user.save();
    const token = await user.getJWTToken();
    res
      .status(200)
      .cookie("JWTtoken", token, {
        expires: new Date(Date.now() + 25982000000),
        httpOnly: true,
        secure: false,
      })
      .json({
        message: "SignUp Succesfull",
        result: {
          user,
          token,
        },
      });
  } catch (e) {
    res.status(400).json(e);
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.send({ message: "Email Id and Password doesn't match" });
    } else {
      if (password !== user.password) {
        res.send({ message: "Email Id and Password doesn't match" });
      } else {
        const token = await user.getJWTToken();
        user.status = "online";
        await user.save();
        res
          .status(200)
          .cookie("JWTtoken", token, {
            expires: new Date(Date.now() + 25982000000),
            httpOnly: true,
            secure: false,
          })
          .json({
            message: "Login Succesfull",
            result: {
              user,
              token,
            },
          });
      }
    }
  } catch (e) {
    res.status(400).json(e.message);
  }
};
