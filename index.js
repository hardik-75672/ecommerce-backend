const mongoose = require("mongoose");
const express = require("express");
const server = express();
const productRouter = require("./router/product.js");
const brandRouter = require("./router/brand.js");
const categoryRouter = require("./router/category.js");
const userRouter = require("./router/user.js");
const authRouter = require("./router/auth.js");
const cartRouter = require("./router/cart.js");
const orderRouter = require("./router/order.js");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');
//library for authentication 
const session = require("express-session");
const LocalStrategy=require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const crypto = require("crypto");
const { User } = require("./model/user.js");
const { sanitize, cookieExtractor, auth } = require("./service/commen.js");
var jwt = require('jsonwebtoken');
const path = require('path');
const SECRET_KEY='SECRET_KEY';

//jwt options
var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = 'SECRET_KEY';


// Webhook

// TODO: we will capture actual order after deploying out server live on public URL

const endpointSecret = "  whsec_cf6f83c48cb6023acbff0071c46b183773ee86daf121445b835573b708bd479f";

server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log({paymentIntentSucceeded})
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

//middlewares
// server.use(express.raw({type: 'application/json'}));
server.use(express.static(path.resolve(__dirname, 'build')))
server.use(cookieParser());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    // origin:"http://localhost:8080",
    exposedHeaders: ["X-Total-Count"],
  })
); 
//payments
server.use(express.json());

server.use("/products",auth(), productRouter.router);
server.use("/category", auth(),categoryRouter.router);
server.use("/brands", auth(),brandRouter.router);
server.use("/users", auth(),userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", auth(),cartRouter.router);
server.use("/orders", auth(),orderRouter.router);
server.get('*', (req, res) =>
  res.sendFile(path.resolve('build', 'index.html'))
);
// Passport strategies
passport.use('local',
  new LocalStrategy(
    {usernameField:'email'},
    async function (email, password, done) {
    console.log(email)
    try {
        const user = await User.findOne(
          { email: email },
        ).exec();
        // TODO: this is just temporary, we will use strong password auth
        if (!user) {
          done(null,false,{message:'no user found'})
      }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {

             if (crypto.timingSafeEqual(user.password, hashedPassword)) {
              const token = jwt.sign(sanitize(user), SECRET_KEY);
              done(null, { id: user.id, role: user.role,token}); // this lines sends to serializer
            } else {
                done(null,false,{message:'invalid'})
            }
          })
      } catch (err) {
        done(err);
      }
  })
);

passport.use('jwt',new JwtStrategy(opts, async function(jwt_payload, done) {
  try{
      const user=await User.findById( jwt_payload.id); 
      if (user) {
        // console.log("p")
          return done(null, sanitize(user));
      } else {
          return done(null, false);
          // or you could create a new account
      }
  }catch{
        return done(err, false);
      } 
}));
//This creates session variable req.user on being called from callbacks

passport.serializeUser(function (user, cb) {
  // console.log(user)

  process.nextTick(function () {
    return cb(null, {id:user.id,role:user.role});
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Payments


// This is your test secret API key.
const stripe = require("stripe")('sk_test_51OkNGIDNKArFpVChSMKNtaNKfVK5nspiN81EagLZJKd8itpBWuDlCp868Caxv8NnJgrkkrJjeYS0AF56re0jA61l00MKVa2hlq');


const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    // name: 'Jenny Rosen',
    amount: totalAmount*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  //   payment_method_types: [
  //   "card",
  //   "link"
  // ],
  //  payment_method:"pmc_1OkUwMDNKArFpVChvAYEYyUS"
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://hardik96500c:hirYAQgz10eohvEn@cluster0.wbxd9is.mongodb.net/ecommerce?retryWrites=true&w=majority");
  console.log("database connected");
}


function isAuth(req,res,done){
  if(req.user){
    done()
  }else{
    res.send(401)
  }
}
// server.get()
server.listen(8080, () => {
  console.log("server connected");
});
