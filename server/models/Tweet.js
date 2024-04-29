const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (tweetText) => _.escape(tweetText).trim();

const TweetSchema = new mongoose.Schema({
  tweetText: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TweetSchema.statics.toAPI = (doc) => ({
  tweetText: doc.tweetText,
  owner: doc.owner,
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;
