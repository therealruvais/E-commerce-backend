const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const User = require("../models/userModel");
const validateMongodbId = require("../utils/validateMongodbId");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");

const createUser = async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    //createnew user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("user already exists");
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      name: findUser?.name,
      email: findUser?.email,
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
};

const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("token not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error("something wrong with refresh token");
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
};

const logOut = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
};

const getAllUsers = async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(`error getting all users`, error);
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const aUser = await User.findById(id);
    res.json(aUser);
  } catch (error) {
    throw new Error(`cannot get requested Id`, error);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.user;
  validateMongodbId(id);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name: req?.body?.name,
      email: req?.body?.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUser) {
    throw new Error(`updating function is not responing`);
  }
  res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteu = await User.findByIdAndDelete(id);
    res.json(deleteu);
  } catch (error) {
    throw new Error(`cannot get requested Id`, error);
  }
};

const blockUser = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({ msg: "user Blocked", block });
  } catch (error) {
    throw new Error(error);
  }
};
const unBlockUser = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unBlock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({ msg: "user Unblocked", unBlock });
  } catch (error) {
    throw new Error(error);
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongodbId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
};

const forgotPasswordToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("user not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi this link is valid till 10 mins from now. <a href="http://localhost:9000/api/user/password-reset/:${token}">Click Here</a> `;
    const data = {
      to: email,
      subject: "Forgot password Link",
      text: "Hey user",
      html: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user) throw new Error("token expired, please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  await user.save();
  res.json(user);
};



module.exports = {
  createUser,
  Login,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  
};
