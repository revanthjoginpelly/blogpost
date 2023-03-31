const express = require("express");
const axios = require("axios");
require("dotenv").config();

const home = express.Router();

const config = {
  API_KEY: process.env.API_KEY,
};

async function getHome(req, res) {
  const response = await axios.get(
    `https://newsapi.org/v2/top-headlines?country=in&language=en&apiKey=${config.API_KEY}`
  );

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

  res.render("home", { newsArray });
}

home.get("/", getHome);

module.exports = home;
