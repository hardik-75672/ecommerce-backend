const { Cart } = require("../model/cart");
exports.fetchCartByUser = async (req, res) => {
  console.log("opopopopopo");
  console.log(req.user);
  const id = req.user;
  try {
    const cartItems = await Cart.find({ user: id.id })
      .populate("product")
      .populate("user");
    // console.log(cartItems)
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.addToCart = async (req, res) => {
  const { id } = req.user;
  console.log(req.user);
  const cart = new Cart({ ...req.body, user: id });
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndDelete(id);
    const result = await cart.populate("product");

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate("product");

    // console.log('ffff'+cart)
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
