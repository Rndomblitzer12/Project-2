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
    return res.status(201).json({ tweet: newTweet.tweetText });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tweet already exists!' });
    }

    return res.status(400).json({ error: 'An error occurred making tweet!' });
  }
};

const getTweets = async (req, res) => {
  try {
    const tweetsWithUsername = await Tweet.aggregate([
      {
        $lookup: {
          from: 'accounts', // Name of the collection to join with
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerData',
        },
      },
      {
        $unwind: '$ownerData',
      },
      {

        $lookup: {
          from: 'filemodels',
          localField: 'ownerData.profilePic',
          foreignField: '_id',
          as: 'profilePictureInfo',

        },
      },

      {
        $project: {
          tweetText: 1,
          owner: 1,
          username: '$ownerData.username',
          profilePicture: { $arrayElemAt: ['$profilePictureInfo.data', 0] }, // Get the username from the joined collection

        },
      },
    ]);

    return res.json({ tweetsWithUsername });
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving tweets with username!' });
  }
};

const deleteTweet = async (req, res) => {
  const { tweetId } = req.params;

  try {
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }
    return res.status(201).json({ tweet: deletedTweet.tweetText });
  } catch (error) {
    // If an error occurs, send a 500 response
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const makerPage = async (req, res) => res.render('app');

module.exports = {
  makerPage,
  makeTweet,
  getTweets,
  deleteTweet,
};
