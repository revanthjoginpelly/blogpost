const express = require("express");
const axios = require("axios");
const path = require("path");

const entertainment = express.Router();

require("dotenv").config();
const config = {
  API_KEY: process.env.API_KEY,
};

async function getEntertainment(req, res) {
  const response = await axios.get(
    `https://newsapi.org/v2/everything?sources=entertainment-weekly,mashable,mtv-news,new-york-magazine,ign&sortBy=popularity&apiKey=${config.API_KEY}`
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

  res.render("entertainment", { newsArray });
}

entertainment.get("/", getEntertainment);

module.exports = entertainment;
