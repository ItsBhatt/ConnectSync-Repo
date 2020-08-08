const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.index = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select(
      "-password -updatedAt -createdAt"
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.getUserById = async (req, res) => {
  try {
    console.log("id-", req.params.userId);
    const user = await User.findById(req.params.userId).select(
      "-password -updatedAt -createdAt"
    );
    console.log(user);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.create = async (req, res) => {
  // console.log("creating user...");
  // console.log(req.header);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecretKey"),
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        console.log("token==", token);
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
