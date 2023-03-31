const express = require("express");
const axios = require("axios");
const path = require("path");
const { connect_mongodb } = require("./mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();

const home = require("./routers/home.Router");
const worldNews = require("./routers/bsinesssRouter");
const sports = require("./routers/sportsRouter");
const business = require("./routers/bsinesssRouter");
const entertainment = require("./routers/entertainmentRouter");
const technology = require("./routers/technologyRouter");
const science = require("./routers/sciencerouter");
const health = require("./routers/healthRouter");
const crypto = require("./routers/cryptoRouter");
const signin = require("./routers/signin");
const register = require("./routers/registerRouter");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./routers/checkAuth");

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

const config = {
  SESSION_SECRET: process.env.SESSION_SECRETS,
};

app.use(
  session({
    secret: "hellofriends",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, ".", "views")));

app.get("/", async (req, res) => {
  const response = await axios.get(
    "https://newsapi.org/v2/top-headlines?country=in&language=en&apiKey=0c7a03412ee247da9eeba65f7669c77a"
  );
  //console.log(response.data.articles)
  const newsArticles = response.data;
  const newsArray = newsArticles.articles.map((article) => {
    return {
      image: article.urlToImage,
      title: article.title,
      description: article.description,
      content: article.content,
      link: article.url,
      author: article.author,
      publishedAt: article.publishedAt,
    };
  });

  res.render("index", { newsArray });
});

app.use("/home", home);

app.use("/signin", checkNotAuthenticated, signin);

app.use("/register", checkNotAuthenticated, register);

app.use("/worldnews", checkAuthenticated, worldNews);

app.use("/sports", checkAuthenticated, sports);

app.use("/business", checkAuthenticated, business);

app.use("/entertainment", checkAuthenticated, entertainment);

app.use("/technology", checkAuthenticated, technology);

app.use("/science", checkAuthenticated, science);

app.use("/health", checkAuthenticated, health);

app.use("/crypto", checkAuthenticated, crypto);

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // Redirect to the home page after logout
    res.redirect("/home");
  });
});

async function startserver() {
  await connect_mongodb();

  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
}

startserver();
