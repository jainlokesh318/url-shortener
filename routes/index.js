const express = require("express");
const router = express.Router();
const Url = require("../models/url");

//@route         GET /:code
//@description   redirect to long/original URL

router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      if (url.expiryDate == null || Date.parse(url.expiryDate) > Date.now())
        return res.redirect(url.longUrl);
      else return res.status(401).json("This URL has expired");
    } else {
      return res.status(404).json("No such URL found");
    }
  } catch (error) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
