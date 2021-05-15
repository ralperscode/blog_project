//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
// currently not used
// const methodOverride = require("method-override"); //enable delete operation for files.

// native modules
const path = require("path"); //used for grabbing file extension names
const crypto = require("crypto"); //used for generating random file names

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(express.static("public"));

// Multer setup and storage engine

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/blogDB',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // encrypt filename before storing it
      crypto.randomBytes(16, (err, buf) => {
        // if error, use built in promise rejection
        if(err) {
          return reject(err);
        }
        // if no error, create filename from crypto buffer, adding original file extension to the end
        const filename = buf.toString('hex') + path.extname(file.originalname);
        // set file info with appropriate file and bucket names
        const fileInfo = {
          filename: filename,
          bucketName: 'thumbnails' //matches the name of the collection that will be setup when connecting to GridFs
        };
        // resolve promise, returning the created fileInfo
        resolve(fileInfo);
      });
    });
  }
});

var upload = multer({
  storage: storage, limits: {fileSize: 6000000, files: 1},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

// Check File Type
function checkFileType(file, cb){
  console.log("checking types");
  // Allowed ext
  const filetypes = /jpeg|jpg|png|/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  // If both exist, than upload is of valid type. Otherwise, send error.
  if(mimetype && extname){
      console.log("all good");
      return cb(null,true);
  } else {
      // send error to next middleware in chain
      // THINK ABOUT THIS MORE. NOT SURE IF IT SERVES ANY REAL PURPOSE
      console.log("sending error")
      cb('Error: Images Only!');
    }
  }

// mongoose setup and schemas

mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
// connect to GridFs

let gfs;
conn.on('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "thumbnails"
  });
});

// Schemas and Models

const postSchema = new mongoose.Schema({
  title: String,
  content: Buffer,
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
    // // this logic isn't needed anymore? handled at specific post get route
    // // won't be necessary since all new posts will have a textContent field for rendering preview
    // for(let i = 0; i< posts.length; i++){
    //   // temp check for post content being a buffer or not
    //   const utf8String = posts[i].content.toString('utf8');
    //   const decoded = JSON.parse(decodeURIComponent(utf8String));
    //   // const decoded = JSON.parse(decodeURIComponent(posts[i].content));
    //   const converter = new QuillDeltaToHtmlConverter(decoded.ops);
    //   const decodedHTML = converter.convert();
    //   // console.log(decodedHTML);
    //   posts[i].decoded_HTML = decodedHTML;
    // }
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
  // store conents as Buffer to save space in mongoDB
  const binaryBody = new Buffer.from(req.body.postBody, "utf-8");
  const newPost = new Post({
    title: req.body.postTitle,
    // content: req.body.postBody,
    content: binaryBody,
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
    // find the relevant post
    if (post._id == req.params.postID){
        // convert buffer to string, decode the URI component, and grab the delta ops array
        const utf8String = post.content.toString('utf8');
        // console.log("utf8String: " + utf8String);
        const decoded = JSON.parse(decodeURIComponent(utf8String));
        const ops = decoded.ops;
        // setup for QDTHTML
        const converter = new QuillDeltaToHtmlConverter(ops, {
          inlineStyles: true, // render styles inline since quill css is dependent on editor
        });

        // tell QDTHTML how to render custom blots
        converter.renderCustomWith(function(ops){
          if (ops.insert.type === "divider"){
            console.log("divider match")
            return "<hr>"
          } else if(ops.insert.type === "caption") {
            console.log("caption match")
            // returns a div with align set based on quill delta attributes
            return '<div align='+ ops.attributes.align + '>' + ops.insert.value + '</div>'
          } else {
            console.log("custom blot not registered");
          }
        });
        // convert the delta to HTML
        const decodedHTML = converter.convert();
        // add this as a key to the post before sending it to render
        post.decoded_HTML = decodedHTML;
        res.render("post", {post: post});
      }
    }
  );
});
});


//temp get route for rendering page to style
app.get("/compose/imgUpload", function(req, res){
  res.render("thumbnail");
});

app.post("/compose/imgUpload", function (req, res) {
  upload.single("thumbnailImage")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("Multer error: "+ err);
    } else if (err) {
      console.log("Unknown error: " + err);
    }
    // console.log(req.file)
    if(!req.file){
      console.log("no file!");
      // get post id from input and find that post
      // update post thumbnail content to point to default image
      // default image will be saved in thumbnails.files as well
      // id of default will be stored in user profile
      // res.json({file: req.file});
    } else{
      console.log("file uploaded")
      // get post id from input and find that post
      // get id of document representing the newly uploaded file
      // update post thumbnail content to point to new image
      // res.json({file: req.file});
    }
  });
})






app.listen(3000, function() {
  console.log("Server started on port 3000");
});


//expansion ideas

//1. make authentication and login abilities for multiple users
//2. make the blog posting more dynamic. Currently can only make a single paragraph.
   // allow for multiple paragraphs. Text styling. Images. Etc.
// fill out actual info on about / contact pages.
