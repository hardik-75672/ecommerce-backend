const { User } = require("../model/user");
const crypto = require("crypto");
const { sanitize, sendMail } = require("../service/commen");
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
  res
    .cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};

exports.resetPasswordRequest = async (req, res) => {
  const email1 = req.body;
  const stringData = email1.toString('utf8');
  const dataObject = JSON.parse(stringData);
  console.log(dataObject)
  const user = await User.findOne({ email: dataObject.email });
 console.log(user)
  if (user) {
  console.log("ko")

    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token;
    await user.save();
    console.log(token)

    // Also set token in email
    const resetPageLink =
      'http://localhost:8080/reset-password?token=' + token + '&email=' + email1;
    const subject = 'reset password for e-commerce';
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

    // lets send email and a token in the mail body so we can verify that user has clicked right link

    if (dataObject.email) {
      const response = await sendMail({ to: dataObject.email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    console.log("lol")
    res.sendStatus(400);
  }
};

exports.resetPassword = async (req, res) => {
  console.log("op")
  const { email, password, token } = req.body;
  const email1 = JSON.parse(email);
  const mainEmail=email1.email;
  console.log(mainEmail)

  const user = await User.findOne({ email: mainEmail, resetPasswordToken: token });

  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();
        const subject = 'password successfully reset for e-commerce';
        const html = `<p>Successfully able to Reset Password</p>`;
        if (mainEmail) {
          const response = await sendMail({ to: mainEmail, subject, html });
          res.json(response);
        } else {
          res.sendStatus(400);
        }
      }
    );
  } else {
    console.log("lolo")
    res.sendStatus(400);
  }
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
