const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

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

client.on("ready", async () => {
  console.log("Client is ready!");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  client.getChats().then((chats) => {
    console.log(chats);
  });
});

client.initialize().catch(console.error);
