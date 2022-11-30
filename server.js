// require("dotenv").config();
const express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const passport = require("passport");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (username) => {
    var ress = AccountModel.findOne({
      username: username,
    });
    return AccountModel.findOne({
      username: username,
    });
  },

  (id) => {
    return AccountModel.findOne({
      _id: id,
    });
  }
);

//connect database
const moongoose = require("mongoose");
const connectDB = async () => {
  try {
    await moongoose.connect(
      "mongodb+srv://hao:hao123@database.x8rpquc.mongodb.net/database?retryWrites=true&w=majority"
    );
    console.log("Mongoose Connected!");
  } catch (error) {
    console.log("Moongoose Error" + error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
const port = 3002;

var bodyParser = require("body-parser");

const AccountModel = require("./models/account");
const jwt = require("jsonwebtoken");
const flash = require("express-flash");
const session = require("express-session");

app.use(cors());

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

const store = session.MemoryStore();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 20,
    },
    store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// xác định route
const dashboardRoute = require("./dashboard/dashboardRoute");
app.use("/dashboard", dashboardRoute);

//////////////////////

// ----------- Register  -----------------------
app.post("/register", async (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  var hashedPassword = await bcrypt.hash(password, 10);

  AccountModel.findOne({
    username: username,
  })
    .then((data) => {
      if (data) {
        res.json("Existed Username");
      } else {
        return AccountModel.create({
          username: username,
          password: hashedPassword,
        });
      }
    })
    .then((data) => {
      res.json("Create account successfully");
    })
    .catch((err) => {
      res.status(500).json("Fail to create account");
    });
});

// --------------- Login feature ---------------------------------
// app.post("/login", (req, res, next) => {
//   var username = req.body.username;
//   var password = req.body.password;

//   AccountModel.findOne({
//     username: username,
//     password: password,
//   })
//     .then((data) => {
//       if (data) {
//         var token = jwt.sign(
//           {
//             _id: data._id,
//           },
//           "mk"
//         );
//         res.json({
//           message: "Login successfully!",
//           userInfo: data,
//           token: token,
//         });
//       } else {
//         res.status(300).json("Login fail!!");
//       }
//     })
//     .catch((err) => {
//       res.status(500).json("Server is in trouble!");
//     });
// });

// app.post("/login", function (req, res, next) {
//   passport.authenticate("local");
//   var token = jwt.sign(
//     {
//       username: req.body.username,
//     },
//     "keyyy"
//   );
//   res.json({ message: "Success", username: req.body.username, token: token });
// });

app.post("/login", passport.authenticate("local"), function (req, res) {
  console.log("userrr", req.user);
  var token = jwt.sign(
    {
      _id: req.user._id,
    },
    "keyyy"
  );
  res.json({ message: "Success", username: req.body.username, token: token });
});

app.get("/private", (req, res, next) => {
  try {
    var token = req.cookies.accessToken;
    var result = jwt.verify(token, "mk");
    if (result) {
      next();
    }
  } catch (error) {
    return res.redirect("/login");
  }
}),
  (req, res, next) => {
    res.json("Welcome");
  };

// ---------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
