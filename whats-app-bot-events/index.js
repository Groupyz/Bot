const express = require("express");
const app = express();
app.listen(3001);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

const routes = require('./routes')
app.use("/", routes);
module.exports = app;
