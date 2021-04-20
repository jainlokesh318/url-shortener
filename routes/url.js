const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const shortid = require("shortid");
const config = require("config");

const Url = require("../models/url");

//@route          GET /api/url
//@description    Fetch all the entries in the database
router.get("/", (req, res) => {
  Url.find({})
    .then((urls) => {
      res.send(urls);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//@route          POST /api/url/shorten
//@description    Create short Url
router.post("/shorten", async (req, res) => {
  const { longUrl, expiresOn } = req.body;
  const baseUrl = config.get("baseUrl");

  let expiryDate = null;
  if (expiresOn !== "") expiryDate = new Date(expiresOn);
  //check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Invalid base Url");
  }

  //create url code
  const urlCode = shortid.generate();

  //check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          creationDate: new Date(),
          expiryDate: expiryDate,
        });

        await url.save();
        res.json(url);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error");
    }
  } else {
    res.status(401).json("Invalid long Url");
  }
});

module.exports = router;
