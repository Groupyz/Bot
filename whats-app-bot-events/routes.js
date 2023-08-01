const express = require("express");
const router = express.Router();
const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");

router.use(express.json());

var client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "../",
  }),
  puppeteer: {
    headless: false,
    args: ["--no-sandbox"],
    browserWSEndpoint: process.env.BROWSER_URL,
  },
});

router.get("/qr", (req, res) => {
  client.on("qr", (qr) => {
    //qr code image parameters
    var opts = init_image_attrubtes();

    //convert qr to DataURL
    QRCode.toDataURL(qr, opts, function (err, url) {
      if (err) throw err;

      res.send(url);
    });
  });

  //happens after client has scanned the qr code
  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.initialize().catch(console.error);
});

init_image_attrubtes = () => {
  return {
    errorCorrectionLevel: "H",
    type: "image/jpeg",
    quality: 0.3,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#FFFFFFFF",
    },
  };
};

module.exports = router;
