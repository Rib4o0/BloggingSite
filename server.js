const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('static'));

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname,'static','homePage.html'));
})

app.get('/blog/:id', (req,res) => {
  let blogId = req.params.id;
  res.set('blog-id', blogId);
  res.sendFile(path.join(__dirname,'static','blog.html'));
})

app.get('/get-blog-data/:id', (req,res) => {
  const blogData = {id: req.params.id, title: 'title', content: 'content'};
  res.send(blogData);
})

app.listen(port,"0.0.0.0", () => {
  console.log(`Listening on port: ${port}`);
})
