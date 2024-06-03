const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());
// require("./app/socketServer");
// require("./app/walletavatar")



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

require("./app/routes/user.routes")(app);
require("./app/routes/ticket.routes")(app);
require("./app/routes/buyTickets.routes")(app);
require("./app/routes/chat.routes")(app);
require("./app/routes/configuration.routes")(app);
// require("./app/routes/image.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

