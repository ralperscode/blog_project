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

// passport modules
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const flash = require("connect-flash");

// native modules
const session = require("express-session")
const path = require("path"); //used for grabbing file extension names
const crypto = require("crypto"); //used for generating random file names
require('dotenv').config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(express.static("public"));

// flash setup
app.use(flash());

// setup express-session
app.use(session({
  secret:process.env.LOCAL_SECRET,
  resave: false,
  saveUninitialized: false
}));

// flash middleware that stores messages in res.locals object, which is accessable by the view engine
app.use(function(req, res, next){
  res.locals.error_message = req.flash('error_message');
  // never need to flash error or success messages but leaving this code here for reference
  // res.locals.success_message = req.flash('success_message');
  // res.locals.error = req.flash('error');
  next();
});

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Multer setup and storage engine
const mongoURI = process.env.MONGODB
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
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
  storage: storage, limits: {fileSize: 6000000, files: 2},
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

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
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
  contentText: String,
  thumbnail: String,
  datePosted: Date,
  featuredPost: Boolean
});

const Post = mongoose.model("Post", postSchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "User must have a name"]
  },
  email: {
    type: String,
    // required: [true, "User must have an email"]
  },
  password: {
    type: String,
    // required: [true, "User must have a password"]
  },
  blogTitle: String,
  blogURL: String,
  posts: [postSchema],
  featuredPost: postSchema,
  defaultImg: String,
  bannerImg: String,
  socialMediaLinks: {facebookLink: "", twitterLink: "", instaLink: "", githubLink: ""},
  googleID: String,
  facebookID: String
});

// add findOrCreate as plugin to userSchema for oAuth strategies
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);


// add a default user

User.findOne({}, function(err, foundUser){
  if (!foundUser){
    const user1 = new User({
      name: "user1",
      password: "password",
      email: "randomEmail@gmail.com",
      posts: [],
      defaultImg: '60a0ff7ecbf20ab18cbc72b5',
      bannerImg: '60a0ff7ecbf20ab18cbc72b5',
      socialMediaLinks: {facebookLink: "facebook.com", twitterLink:"twitter.com"}
    });
    user1.save();
  }
});

// local authentication strategy and session serialization
passport.use(new LocalStrategy({
  usernameField: "name",
  passReqToCallback: true //needed so req.flash can be used
},
  function(req, username, password, done){
    User.findOne({name: username}, function(err, user){
      if(err){
        return done(err);
      }
      if(!user){
        console.log("no user");
        // done is a passport function that returns an authenticated user
        // or false if a login mistake was made
        // use req.flash to provide res.locals with the error message
        return done(null, false, req.flash("error_message", "Username not found"));
      }
      // use bycrypt.compare() to check user entered password against hash in db
      bcrypt.compare(password, user.password, function(err, result){
        if(!result){
        console.log("password failure");
        return done(null, false, req.flash("error_message", "Invalid password"));
        }
        // if username and password matched, return the authenticated user in done()
        console.log("returning user");
        return done(null, user);
      });
    });
  }
));

// serialize session with the authenticated user's id
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// oAuth strategies

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo" //must add for google redirect to work
  },
  function(accessToken, refreshToken, profile, cb) {
    const email = profile.emails[0].value;
    var userName = ""
    for (var i = 0; i < email.length; i++) {
      if(email[i] === "@"){
        break
      } else{
        userName += email[i]
      }
    }
    User.findOrCreate({ googleID: profile.id }, {name: userName, email: email}, function (err, user) {
      return cb(err, user);
    });
}));

// ensureAuthentication middleware function for all secured routes
function ensureAuthentication(req, res, next){
  if (req.isAuthenticated()){
    next();
  } else{
    res.redirect("/");
  }
}

// checkUser middleware for ensuring a logged in user isn't accessing another user's secured routes
function checkUser(req, res, next){
  if (req.user.name === req.params.userName){
    next();
  } else{
    req.logout();
    res.redirect("/");
  }
}

// isLoggedIn used in callback to find a logged in user for altering header button options
function isLoggedIn(req){
  if (req.user){
    return (req.user.name === req.params.userName);
  } else {
    return false;
  }
}

//global variables
let posts = [];

app.get("/", function(req, res){
  res.render("landing");
});

app.post("/login", passport.authenticate("local"), function(req, res){
  console.log("req.user: " + req.user);
  res.redirect("/blog/" + req.body.name);
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register/userInfo", function(req, res){
  console.log("request received");
  //hash their password with bcrypt and saltRounds defined in require block
  bcrypt.hash(req.body["password"], saltRounds, function(err, hash){
    // new user is created in .hash callback so we have access to the hash
    const newUser = new User({
      name: req.body["username"],
      email: req.body["email"],
      password: hash
    });
    // save the user and end response -> no authentication or redirects as user must still select images
     newUser.save();
    res.end();
  });
});

app.post("/register/userInfo/nameCheck", function(req, res){
  User.findOne({name: req.body["username"]}, function(err, foundUser){
    if(foundUser){
      res.send("taken");
    } else{
      res.send("not_taken");
    }
  });
});

app.post("/register/userInfo/blogTitle", function(req, res){
  User.findOne({name: req.body["username"]}, function(err, foundUser){
    foundUser.blogTitle = req.body["title"];
    foundUser.save();
    res.end();
  })
})

app.post("/register/userInfo/img", function(req, res){
  upload.fields([{ name: 'defaultThumbnail', maxCount: 1 }, { name: 'banner', maxCount: 1 }])(req, res, function(err){
    User.findOne({name: req.body.newUserName}, async function(err, foundUser){
      foundUser.defaultImg = req.files.defaultThumbnail[0].id;
      foundUser.bannerImg = req.files.banner[0].id;

      await foundUser.save();
      res.render("login");
      });
    });
});

// oAuth Routes

// Google
app.get("/auth/google",
  passport.authenticate('google', { scope: ['profile','email'] }));

// this is the route called when a user successfully logs in with google
// simply authenticates user and redirects home
app.get("/auth/google/home",
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, check if user is new and redirect to appropriate route
      console.log(req.user.blogTitle);
      console.log(req.user.blogTitle === undefined);
      if (req.user.blogTitle === undefined){
        console.log("in if, about to redirect")
        res.redirect('/oauth/register/userinfo');
      } else{
        console.log("why am i here?")
        res.redirect('/blog/' + req.user.name);
      }
    });

app.get("/oauth/register/userinfo", ensureAuthentication, function(req, res){
  console.log("in oauth register get route, about to render oauthRegister page");
  console.log("req.user.name: " + req.user.name);
  res.render("oauthRegister", {user: req.user.name});
});

app.post("/oauth/register/userInfo/img", function(req, res){
  upload.fields([{ name: 'defaultThumbnail', maxCount: 1 }, { name: 'banner', maxCount: 1 }])(req, res, function(err){
    User.findOne({name: req.body.newUserName}, async function(err, foundUser){
      foundUser.defaultImg = req.files.defaultThumbnail[0].id;
      foundUser.bannerImg = req.files.banner[0].id;

      await foundUser.save();
      res.redirect("/blog/" + foundUser.name);
      });
    });
});

app.get("/blog/:userName", function(req, res){
  const loggedIn = isLoggedIn(req);
  User.findOne({name: req.params.userName}, function(err, foundUser){
    let posts = foundUser.posts
    res.render("blog", {homeStartingContent: homeStartingContent, posts: posts, user: foundUser, isUser: loggedIn});
    // // Additional check for file type content -> not used currently.
    // // I think the checks before uploading are sufficient for determining file type
    // get all thumbnail image files
    // gfs.find().toArray((err, files) => {
    //   if (!files || files.length === 0){
    //     return res.status(200).json({
    //       success: false,
    //       message: 'No files found'
    //     });
    //   }
    // files.map(file => {
    //   if (file.contentType === "image/jpeg" || file.contentType === "image/png"){
    //     file.isImage = true;
    //   } else{
    //     file.isImage = false;
    //   }
    // });
    // res.json({file: files});
    // res.render("home", {homeStartingContent: homeStartingContent, posts: posts})
    // });
  });
});

app.get("/profile/:userName", ensureAuthentication, checkUser, function(req, res){
  User.findOne({name: req.params.userName}, function(err, foundUser){
    const posts = foundUser.posts
    res.render("userProfile", {posts: posts, user: foundUser, isUser: true});
  });
});

// app.get("/about", function(req, res){
//   res.render("about", {aboutContent: aboutContent});
// });

app.get("/blog/:userName/compose", ensureAuthentication, checkUser, function(req, res){
  User.findOne({name: req.params.userName}, function(err, foundUser){
    res.render("compose", {user:foundUser, isUser: true});
  });
});

app.post("/blog/:userName/compose", function(req, res){
  console.log("New post composed!");
  console.log("title: " + req.body.postTitle);
  // store conents as Buffer to save space in mongoDB
  const binaryBody = new Buffer.from(req.body.postBody, "utf-8");
  const newPost = new Post({
    title: req.body.postTitle,
    // content: req.body.postBody,
    content: binaryBody,
    contentText: req.body.postBodyText,
    datePosted: new Date()
  });
  User.findOne({name: req.params.userName}, function(err, foundUser){
    foundUser.posts.push(newPost);
    foundUser.save().then(res.render("thumbnail", {post: newPost, user:foundUser}));
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

//temp get route for rendering page to style
// app.get("/blog/:userName/compose/imgUpload", function(req, res){
//   res.render("thumbnail");
// });

app.post("/blog/:userName/compose/imgUpload", function (req, res) {
  User.findOne({name: req.params.userName}, function(err, foundUser){
    let posts = foundUser.posts;
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
        posts.forEach(function(post){
          // get post id from input and find that post
          if (post._id == req.body.postID){
            // update post thumbnail content to point to default image
            // id of default is stored in user profile
            post.thumbnail = foundUser.defaultImg
            foundUser.save().then(res.redirect("/blog/"+ foundUser.name));
            // console.log("updated post: " + post);
            // note: default image will be saved in thumbnails.files as well
          }
        });
         // res.json({file: req.file});
      } else{
        console.log("file uploaded")
        posts.forEach(async function(post){
          // get post id from input and find that post
          if (post._id == req.body.postID){
            // update post thumbnail content so it equals newly uploaded file
            post.thumbnail = req.file.id
            await foundUser.save();
            res.redirect("/blog/"+ foundUser.name);
            // console.log("updated post: " + post);
          }
        });
         // res.json({file: req.file});
      }
    });
  });
});

// Route for editing posts accessed from user profile
app.get("/profile/:userName/edit/:postID", ensureAuthentication, checkUser, function(req, res){
  User.findOne({name: req.params.userName}, function(err, foundUser){
    let posts = foundUser.posts;
    posts.forEach(function(post){
      if (post._id == req.params.postID){
        // convert buffer to string, decode the URI component, and grab the delta ops array
        const utf8String = post.content.toString('utf8');
        const decoded = JSON.parse(decodeURIComponent(utf8String));
        const ops = decoded.ops;
        res.render("editPost", {user: foundUser, isUser: true, post: post, delta: utf8String});
      }
    });
  });
});

// post route for updating post content
app.post("/profile/:userName/edit/:postID", function(req, res){
  console.log("edits submitted to post route");
  const binaryBody = new Buffer.from(req.body.postBody, "utf-8");
  const textBody = req.body.postBodyText;
  User.findOne({name: req.params.userName}, function(err, foundUser){
    foundUser.posts.forEach(async function(post){
      if (post.id == req.params.postID){
        post.content = binaryBody;
        post.textContent = textBody;
        await foundUser.save()
        res.redirect("/blog/"+ foundUser.name + "/posts/" + post.id);
      }
    });
  });
});

// post route for changing a post's thumbnail image
app.post("/profile/:userName/edit/:postID/thumbnail", function(req, res){
  User.findOne({name: req.params.userName}, function(err, foundUser){
    const postID = req.params.postID;
    // use multer to upload the image
    upload.single("thumbnailImage")(req, res, function (err) {
      console.log("uploading...");
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("Multer error: "+ err);
      } else if (err) {
        console.log("Unknown error: " + err);
      }
      // no file sent to server -> default img selected
      if (!req.file){
        console.log("No file!");
        foundUser.posts.forEach(function(post){
          if (post.id == postID){
            console.log("updating post with default img");
            post.thumbnail = foundUser.defaultImg;
            foundUser.save().then(res.end());
          }
        });
      } else{
        // new image uploaded -> save this as thumbnail
        console.log("file uploaded");
        foundUser.posts.forEach(function(post){
          if(post.id == postID){
            console.log("updating post with new file");
            post.thumbnail = req.file.id;
            foundUser.save().then(res.end());
          }
        });
      }
    });
  })
});

app.get("/blog/:userName/posts/:postID", function(req, res){
const loggedIn = isLoggedIn(req);
User.findOne({name: req.params.userName}, function(err, foundUser){
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
        res.render("post", {user: foundUser, post: post, isUser: loggedIn});
      }
    }
  );
});
});

// Route for getting images back from Grid FS Bucket
// Used in home.ejs as source attribute for thumbnail images
app.get("/images/:imgId", function(req, res){
  //toArray still needed because find returns a cursor???
       // honest question, haven't tried removing toArray
  let imgId = new mongoose.mongo.ObjectId(req.params.imgId);
  // check if image exists
  gfs.find({_id: imgId}).toArray((err, files) =>{
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'Could not find that file'
      });
    } else{
      // Open new download stream and pipe it's data to res
      let downloadStream = gfs.openDownloadStream(files[0]._id);
      downloadStream.pipe(res);
    }
  });
});

// route for updating user settings triggered by ajax call
app.post("/profile/:userName/update/:userSetting", function(req, res){
  // grab the setting to update from the request parameter that was built during ajax call
  const settingToChange = req.params.userSetting;
  // get the appropriate user
  User.findOne({name: req.params.userName}, function(err, foundUser){
    // social links are stored in an object so check for those, otherwise update
    if (settingToChange === "defaultImg"){
      upload.single("thumbnailImg")(req, res, function (err) {
        console.log("uploading...");
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.log("Multer error: "+ err);
        } else if (err) {
          console.log("Unknown error: " + err);
        }
        if (!req.file){
          console.log("No file!");
        } else{
          console.log("file uploaded");
          foundUser.defaultImg = req.file.id;
          foundUser.save();
        }
    });
  } else if (settingToChange === "bannerImg"){
    upload.single("bannerImg")(req, res, function (err) {
      console.log("uploading...");
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("Multer error: "+ err);
      } else if (err) {
        console.log("Unknown error: " + err);
      }
      if (!req.file){
        console.log("No file!");
      } else{
        console.log("file uploaded");
        foundUser.bannerImg = req.file.id;
        foundUser.save();
      }
    });
  } else if(settingToChange == "featuredPost"){
    const posts = foundUser.posts;
    const newFeatured = req.body[settingToChange];
    posts.forEach(function(post){
      if (post.title === newFeatured){
        post.featuredPost = true;
      } else{
        post.featuredPost = false;
      }
    });
  } else if (settingToChange === "facebookLink" || settingToChange === "twitterLink" || settingToChange === "instaLink" || settingToChange === "githubLink"){
      foundUser.socialMediaLinks[settingToChange] = req.body[settingToChange] // req.body contains the new setting value
    } else{
      foundUser[settingToChange] = req.body[settingToChange];
    }
    if (settingToChange === "name"){
      foundUser.blogURL = "localhost:3000/blog/" + req.body[settingToChange]
    }
    foundUser.save();
    res.end();
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


// POTENTIAL BUGS
//1. updating username and blogURL not working perfectly. Re-check after authentication / login is implemented

//expansion ideas
//1. make authentication and login abilities for multiple users
//2. make the blog posting more dynamic. Currently can only make a single paragraph.
   // allow for multiple paragraphs. Text styling. Images. Etc.
// fill out actual info on about / contact pages.
//3. MUST DO -- handle password encryption
