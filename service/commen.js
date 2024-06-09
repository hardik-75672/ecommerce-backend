const passport = require("passport");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "hardik96500c@gmail.com",
    pass: "veps rqkp bkap tfzj",
  },
});

exports.auth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitize = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  //TODO : this is temporary token for testing without cookie

  return token;
};

exports.sendMail = async function ({ to, subject, text, html }) {
  console.log("email");
  try {
    let info = await transporter.sendMail({
      from: '"E-commerce" <hardik96500@gmail.com>', // sender address
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.log(error);
  }
};
