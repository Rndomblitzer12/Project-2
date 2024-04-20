const models = require('../models');

const { Tweet } = models;

const makeTweet = async (req, res) => {
  if (!req.body.tweetText) {
    return res.status(400).json({ error: 'No text found.' });
  }

  const tweetData = {
    tweetText: req.body.tweetText,
    owner: req.session.account._id,
  };

  try {
    const newTweet = new Tweet(tweetData);
    await newTweet.save();
    return res.status(201).json({ tweet: newTweet.tweetText});
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tweet already exists!' });
    }

    return res.status(400).json({ error: 'An error occurred making tweet!' });
  }
};

const getTweets = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Tweet.find(query).select('tweetText').lean().exec();

    return res.json({ tweets: docs });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Error retrieving tweets!' });
  }
};

const makerPage = async (req, res) => res.render('app');

module.exports = {
  makerPage,
  makeTweet,
  getTweets,
};
