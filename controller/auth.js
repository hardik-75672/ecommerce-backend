const { User } = require("../model/user");
const crypto = require("crypto");
const { sanitize } = require("../service/commen");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "SECRET_KEY";
exports.createUser = async (req, res) => {
  try {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        req.login(sanitize(doc), function (err) {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitize(doc), SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: doc.id, role: doc.role });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const user = req.user;
  // console.log(user)
  res
    .cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};

exports.checkAuth = async (req, res) => {
  if(req.user){
// console.log("opopo")
    res.json(req.user);
  }else{
    req.sendStatus(404);
  }
};

exports.logout = async (req, res) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};
