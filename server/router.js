const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getTweets', mid.requiresLogin, controllers.Tweet.getTweets);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/profilePic/:userId', mid.requiresLogin, controllers.Account.getProfilePic);
  app.delete('/deleteTweet/:tweetId', mid.requiresLogin, controllers.Tweet.deleteTweet);

  app.get('/maker', mid.requiresLogin, controllers.Tweet.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Tweet.makeTweet);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
