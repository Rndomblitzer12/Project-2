const FileModel = require('../models/filestore.js');
const File = require('../models/filestore.js');

const uploadPage = (req, res) => {
  res.render('upload');
};

const uploadFile = async (req, res) => {
  if (!req.files || !req.files.sampleFile) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const { sampleFile } = req.files;

  try {
    const newFile = new File(sampleFile);
    const doc = await newFile.save();
    return res.status(201).json({
      message: 'File stored successfully!',
      fileId: doc._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Something went wrong uploading file!',
    });
  }
};

const retrieveFile = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let doc;
  try {
    // First we attempt to find the file by the _id sent by the user.
    doc = await File.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    // If we have an error contacting the database, let the user know something happened.
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving file!' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }

  res.set({
    'Content-Type': doc.mimetype,

    'Content-Length': doc.size,

    'Content-Disposition': `filename="${doc.name}"`, /* `attachment; filename="${doc.name}"` */
  });

  return res.send(doc.data);
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass}`;
  const { profilePic } = req.files;

  if (!username || !pass || !pass2 || !profilePic) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Password do not match!' });
  }

  const profilePicDoc = new FileModel(profilePic);
  try {
    await profilePicDoc.save();
  } catch (err) {
    return res.status(500).json({ error: 'failed to create account' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, profilePic: profilePicDoc._id });
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
    res.send(pic.data);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ error: 'could not find profile pic' });
  }
};

module.exports = {
  uploadPage,
  uploadFile,
  getProfilePic,
};
