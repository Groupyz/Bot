const express = require("express");
const router = express.Router();
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

router.use(express.json());

router.get("/qr", (req, res) => {
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

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.initialize().catch(console.error);

  res.send("Hello qr!");
});


module.exports = router;