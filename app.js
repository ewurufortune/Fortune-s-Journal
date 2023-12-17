//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to my micro-blog/journal site! This is a place where I share my thoughts and experiences as a newcomer to the tech industry. You can expect to find posts about the challenges and triumphs I encounter as I learn and grow in this exciting field. I hope that my journey can provide insight and inspiration to others who are also just starting out in tech. Thank you for visiting and I hope you enjoy reading my posts.";
const aboutContent = "Hello and welcome to my site! My name is Fortune and I am a Web App developer. I am passionate about technology and love sharing my thoughts and experiences through writing. On this site, you will find a collection of micro-blogs, journal entries and articles that cover a range of topics, from web app developments to med tech. I hope that my words will provide a fresh perspective and inspire others to think more deeply about the world around us. Thank you for taking the time to visit and I hope you find something that resonates with you.";
const contactContent = "I would love to hear from you! Whether you have a question, comment, or just want to connect, don't hesitate to reach out to me. I'm always open to meeting new people and having thoughtful conversations. You can find my contact information at the bottom of this page. Don't be a stranger, I can't wait to hear from you!";
const twitter='https://twitter.com/EwuruFortune/'

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://fortune:1234@resourcecluster.inplmwx.mongodb.net/personalBlogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({})
  .then(posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
  .catch(err => {
    console.error(err);
    // Handle the error as needed
  });

});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save()
  .then(() => {
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    // Handle the error as needed
  });

});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

Post.findOne({ _id: requestedPostId })
  .then(post => {
    console.log(post);
    res.render("post", {
      title: post.title,
      content: post.content
    });
  })
  .catch(err => {
    console.error(err);
    // Handle the error as needed
  });


});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent,twitter:twitter});
});


const PORT = process.env.PORT || 3030;

// your code

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});