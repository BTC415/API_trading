const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const http = require('http');
const AWS = require('aws-sdk'); // If interacting with other AWS services
// const mql = require('./app/utils/mql.js');
AWS.config.update({
  region: 'Virginia', 
  accessKeyId: 'ec2-54-11-191-126.compute-1.amazonaws.com',
  secretAccessKey: '9Lvm8aouN&GvO1xD=EDPQa$udoX09-Yj'
});
const app = express();

app.use(fileUpload());
// require("./app/socketServer");
// require("./app/walletavatar")

require("./socket_server");
require("./app/utils/mt4-bridge")


var corsOptions = {
  origin: "*"
  
};
dotenv.config();
app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// parse requests of content-type - application/json
app.use(express.json());
// mongoose.connect("mongodb://localhost/phantom-avatars", { useNewUrlParser: true, useUnifiedTopology: true });
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/configuration.routes")(app);
require("./app/routes/history.routes")(app);
require("./app/routes/trading.routes")(app);
require("./app/routes/auth.routes")(app);

// Create an HTTP server to handle HTTP requests
const httpServer = http.createServer(app);
// require("./socket_server")(httpServer);
// set port, listen for requests
const PORT = process.env.PORT || 80;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });
// Start the HTTP server on port 5000
httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});
