const models = require('../models');
const FileModel = require('../models/filestore.js');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass}`;
  console.log(req);
  const { profilePic } = req.files;

  if (!username || !pass || !pass2 || !profilePic) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Password do not match!' });
  }

  const profilePicDoc = new FileModel(profilePic);
  console.log(profilePicDoc);
  try {
    await profilePicDoc.save();
  } catch (err) {
    return res.status(500).json({ error: 'failed to create account' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, profilePic: profilePic._id });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(400).json({ error: 'An error occured!' });
  }
};

const getProfilePic = async (req, res) => {
  try {
    const pic = FileModel.findById(req.session.account.profilePic).lean().exec();

    if (!pic) {
      return res.status(404).json({ error: 'could not find profile pic' });
    }

    res.set({
      'Content-Type': pic.mimetype,
      'Content-Length': pic.size,
    });
    return res.send(pic.data);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ error: 'could not find profile pic' });
  }
};

// todo Add Reset Password functionality

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getProfilePic,
};
