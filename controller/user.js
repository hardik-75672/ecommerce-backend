const { Category } = require("../model/category");
const { User } = require("../model/user");

exports.fetchUserById = async (req, res) => {
  console.log(req.user);
  const id = req.user;
  console.log("ID", id);
  try {
    const user = await User.findById(id.id);
    console.log(user);
    res.status(200).json({
      id: user.id,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.log("noooo");
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params._id;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.allUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};
