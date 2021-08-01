const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require('@mailchimp/mailchimp_marketing')
const app = express();
require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // Create JavaScript Object
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_KEY,
    server: process.env.MAILCHIMP_SERVER
  });

  const run = async () => {
    try {
      const response = await mailchimp.lists.batchListMembers(process.env.MAILCHIMP_ID, data);
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT, function(){
  console.log("Server is running!");
});
