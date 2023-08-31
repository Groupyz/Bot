const express = require("express");
const router = express.Router();
const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");
const qrcode = require("qrcode-terminal");
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
    //print qr for testing
    qrcode.generate(qr, { small: true });

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

router.get("/chats", (req, res) => {
  client.getChats().then((chats) => {
    if (!chats) {
      return res.status(500).send("Error: could not export chats");
    }

    return res.status(200).send(chats);
  });
});

router.post("/sendMessage", (req, res) => {
  group_id = req.body.group_id;
  message_body = req.body.message_body;
  message = sendMessages(group_id, message_body);

  if ("except" in message) {
    return res.status(404).send(message);
  }
  
  return res.status(200).send("Message: " + message_body + "was sent succesfully to groups: " + group_id);
  
});

sendMessages = async (groups_ids, message_body) => {
  const failed_groups = [];
  for (const id of groups_ids) {
    const formattedId = id + "@g.us";
    try {
      await client.sendMessage(formattedId, message_body);
    } catch (error) {
      console.error(`Error sending message to group: ${formattedId}:`, error);
      failed_groups.push(error);
    }
  }

  if (!failed_groups) {
    return (
      "Message" + message_body + "was send to all groups except:" + failed_groups
    )
  }

};


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
