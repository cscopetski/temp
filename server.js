import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import bodyParser from "body-parser";
import { config } from "dotenv";
import {
  addFood,
  deleteFoods,
  editFood,
  getUser,
  getUserFoods,
  loginUser,
} from "./server/mongo-access.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportConfig from "./server/passport.js";
import { Strategy as GitHubStrategy } from "passport-github2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cookieParser("" + process.env.COOKIE_SECRET));
app.use(
  session({
    secret: "" + process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      //cookie expires in 30 days
      maxAge: 1000 * 30 * 24 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, { email: user.id });
});

passport.deserializeUser(function (email, cb) {
  cb(null, email);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.HOST + "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

const logger = (req, res, next) => {
  console.log("url:", req.url);
  next();
};

app.use(logger);

const auth = (req, res, next) => {
  if (req.session.email) {
    next();
  } else {
    res.redirect("/");
  }
};

app.use("/list", express.static("public"));
app.get("/list", auth, (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@a3-persistence.3980rq3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

export let collection = null;

client
  .connect()
  .then(() => {
    return client.db("a3-persistence").collection("users");
  })
  .then((__collection) => {
    collection = __collection;

    return collection.find({}).toArray();
  })
  .then(console.log);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function (req, res) {
    req.session.email = req.user.id;
    console.log("BPODY:");

    console.log(req.session.email);

    loginUser({ email: req.session.email, password: null })
      .then((data, err) => {
        req.session.email = data.email;
        res.status(200);
        res.redirect("/list");
      })
      .catch((err) => {
        console.log(err);
        res.status(403);
        res.redirect("/");
      });
  }
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/login.html");
});

app.get("/get-food", auth, (req, res) => {
  console.log("User: " + req.user);
  console.log(req.user);
  console.log("Session: " + req.session);
  console.log(req.session);
  getUserFoods(req.session.email)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/submit", (req, res) => {
  const json = req.body;
  json.priceperpound =
    json.foodweight === 0 ? 0 : json.foodprice / json.foodweight;
  json.id = Date.now().toString(36) + Math.random().toString(36).substring(2);

  addFood(req.session.email, json)
    .then((prom) => {
      getUserFoods(req.session.email)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(400);
        });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/edit", (req, res) => {
  const food = req.body;
  food.priceperpound =
    food.foodweight === 0 ? 0 : food.foodprice / food.foodweight;

  editFood(req.session.email, food)
    .then((prom) => {
      getUserFoods(req.session.email)
        .then((data) => {
          console.log(data);
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(400);
        });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", async (req, res) => {
  loginUser(req.body)
    .then((data, err) => {
      req.session.email = data.email;
      res.status(200);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(403);
    });
});

app.get("/logout", async (req, res) => {
  req.session = null;

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  console.log(req.session.email, req.body);

  deleteFoods(req.session.email, req.body)
    .then((prom) => {
      console.log(prom);
      getUserFoods(req.session.email)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(400);
        });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.listen(process.env.PORT || 3000);
