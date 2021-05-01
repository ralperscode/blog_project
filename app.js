//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(express.static("public"));

// mongoose setup and schemas

mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  contentText: String
});

const Post = mongoose.model("Post", postSchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"]
  },
  password: {
    type: String,
    required: [true, "User must have a password"]
  },
  posts: [postSchema]
});

const User = mongoose.model("User", userSchema);


// add a default user

User.findOne({}, function(err, foundUser){
  if (!foundUser){
    const user1 = new User({
      name: "user1",
      password: "password",
      posts: []
    });
    user1.save();
  }
});

//global variables
let posts = [];

app.get("/", function(req, res){
  User.findOne({name: "user1"}, function(err, foundUser){
    let posts = foundUser.posts
    for(let i = 0; i< posts.length; i++){
      const decoded = JSON.parse(decodeURIComponent(posts[i].content));
      const converter = new QuillDeltaToHtmlConverter(decoded.ops);
      const decodedHTML = converter.convert();
      console.log(decodedHTML);
      posts[i].decoded_HTML = decodedHTML;
    }
    res.render("home", {homeStartingContent: homeStartingContent, posts: posts});
  });
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  console.log("New post composed!");
  console.log("title: " + req.body.postTitle);
  console.log("Body: " + req.body.postBody);
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    contentText: req.body.postBodyText
  });
  User.findOne({name: "user1"}, function(err, foundUser){
    foundUser.posts.push(newPost);
    foundUser.save().then(res.redirect("/"));
    // // works
    // foundUser.save(function(err){
    //   if(!err){
    //     res.redirect("/");
    });
  });

  // // make it async and use wait
  // User.findOne({name: "user1"}, async function(err, foundUser){
  //   foundUser.posts.push(newPost);
  //   await foundUser.save();
  //   res.redirect("/");
//});

app.get("/posts/:postID", function(req, res){
User.findOne({name: "user1"}, function(err, foundUser){
  let posts = foundUser.posts;
  posts.forEach(function(post){
    if (post._id == req.params.postID){
        const decoded = JSON.parse(decodeURIComponent(post.content));
        const converter = new QuillDeltaToHtmlConverter(decoded.ops);
        const dividerOp = {
          insert: {
            type: "divider",
            value: true
          },
          attributes: {
            renderAsBlock: true
          }
        }
        converter.renderCustomWith(function(dividerOp){
          if (dividerOp.insert.type === "divider"){
            return "<hr>"
          } else {
            console.log("custom blot convert error");
          }
        });
        const decodedHTML = converter.convert();
        console.log(decodedHTML);
        post.decoded_HTML = decodedHTML;
        res.render("post", {post: post});
      }
    }
  );
});
});









app.listen(3000, function() {
  console.log("Server started on port 3000");
});


//expansion ideas

//1. make authentication and login abilities for multiple users
//2. make the blog posting more dynamic. Currently can only make a single paragraph.
   // allow for multiple paragraphs. Text styling. Images. Etc.
// fill out actual info on about / contact pages.
