//jshint esversion:6
const express=require("express");
const app=express();

const request=require("request");
const https=require("https");

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

//The public folder which holds the CSS
app.use(express.static(__dirname+"/public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})
//Requiring mailchimp's module
//For this we need to install the npm module @mailchimp/mailchimp_marketing. To do that we write:
//npm install @mailchimp/mailchimp-marketing
const mailchimp = require("mailchimp-marketing");
//Setting up MailChimp
mailchimp.setConfig({
  apiKey: "",
  server: "us11"
});

app.post("/",function(req,res){
  const firstName=req.body.fname;
  const lastName=req.body.lname;
  const emailAddress=req.body.email;

  const status=res.statusCode;
  console.log(status);

  const listid="";

//Uploading the data to the server
  const run = async () => {
  const response = await mailchimp.lists.batchListMembers(listid, {
    members: [{
      email_address:emailAddress,
            status:"subscribed",
            merge_fields:{
              FNAME:firstName,
              LNAME:lastName
            }
    }]
  });
  res.sendFile(__dirname + "/success.html");
  console.log(res);
  // response.sendFile(__dirname + "/success.html");

};
// run();
run().catch(e => res.sendFile(__dirname + "/failure.html"));

// response.sendFile(__dirname + "/failure.html");
});

app.post("/failure",function(req,res){
  res.redirect("/");
})
// Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.listen(process.env.POST||3000,function(){
  console.log("server is running on port 3000.");
})
