const express = require("express");
const router = express.Router();
const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");

router.use(express.json());

router.get("/qr", (req, res) => {

  //create a new client
  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: "../",
    }),
    puppeteer: {
      headless: false,
      args: ["--no-sandbox"],
      browserWSEndpoint: process.env.BROWSER_URL,
    },
  });

  //create qr code for client
  client.on("qr", (qr) => {

  //qr code image parameters
  var opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
      dark:"#000000",
      light:"#FFFFFFFF"
    }
  }
  
  //convert qr to DataURL
  QRCode.toDataURL(qr, opts, function (err, url) {
    if (err) throw err
  
    res.send(url);
  })
});

  //happens after client has scaned the qr code
  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.initialize().catch(console.error);

});


module.exports = router;