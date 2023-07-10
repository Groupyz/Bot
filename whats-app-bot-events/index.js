const express = require('express')
const { Client, LocalAuth } = require("whatsapp-web.js");
const app = express();
app.listen(3001);

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "../",
  }),
  puppeteer: {
    headless: false,
    args: ["--no-sandbox"],
    browserWSEndpoint: process.env.BROWSER_URL
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
 });

client.initialize().catch(console.error);
