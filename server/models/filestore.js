/* This model file defines the mongoose schema and model for a
   database collection that can store files. The format is based
   on the file object that is sent to our server by the browser
   when the user uploads a file.
*/
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  data: {
    type: Buffer,
  },

  size: {
    type: Number,
  },

  mimetype: {
    type: String,
  },
});

// Finally we construct a model based on our schema above.
const FileModel = mongoose.model('FileModel', FileSchema);

module.exports = FileModel;
