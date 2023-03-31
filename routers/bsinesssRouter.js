const express = require("express");
const axios = require("axios");

const business = express.Router();

require("dotenv").config();
const config = {
  API_KEY: process.env.API_KEY,
};
async function getBusiness(req, res) {
  const response = await axios.get(
    `https://newsapi.org/v2/everything?sources=bbc-news,the-times-of-india,the-hindu,bloomberg,business-insider&apiKey=${config.API_KEY}`
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

  res.render("business", { newsArray });
}

business.get("/", getBusiness);

module.exports = business;
