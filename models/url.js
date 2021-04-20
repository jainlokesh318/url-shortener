const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  creationDate: {
    type: String,
    default: Date.now,
  },
  expiryDate: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Url", urlSchema);
