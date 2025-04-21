const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email");
const { forgotPasswordTemplate } = require("../templates");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    if (
      !username ||
      !email ||
      !email.includes("@") ||
      !password ||
      !passwordConfirm
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide valid credentials",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "fail",
        message: "User with this email or username already exists",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Password confirm doesn't match",
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    // Create JWT token with user ID
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });

    const userData = {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({
      err,
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    // Create user object without password
    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      status: "success",
      message: "User logged in successfully",
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({
      err,
      message: "Something went wrong",
    });
  }
};

const userCheckIn = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      status: "success",
      message: "User checked in successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      err,
      message: "Something went wrong",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User with this email not found",
    });
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    const html = forgotPasswordTemplate(resetURL);

    await sendEmail(email, "Reset Password", html);

    res.status(200).json({
      status: "success",
      message: "Password reset token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      err,
      message: "Something went wrong",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or expired token",
      });
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      err,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  register,
  login,
  userCheckIn,
  forgotPassword,
  resetPassword,
};
