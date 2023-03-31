const express = require("express");
const axios = require("axios");
const path = require("path");

const health = express.Router();

require("dotenv").config();
const config = {
  API_KEY: process.env.API_KEY,
};

async function getHealth(req, res) {
  const response = await axios.get(
    `https://newsapi.org/v2/everything?sources=medical-news-today&sortBy=popularity&apiKey=${config.API_KEY}`
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

  res.render("health", { newsArray });
}

health.get("/", getHealth);

module.exports = health;
