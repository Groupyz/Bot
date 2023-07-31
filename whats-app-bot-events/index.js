const express = require("express");
const app = express();
app.listen(3001);


const routes = require('./routes')
app.use("/", routes);
module.exports = app;
