const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('static'));

var blogs = [];
var users = [];
var sessions = [];

fs.readFile(path.join(__dirname, 'Data', 'blogs.json'), 'utf8', (err, data) => {
  if (err) throw err;
  if (data != '') blogs = JSON.parse(data);
});
fs.readFile(path.join(__dirname, 'Data', 'users.json'), 'utf8', (err, data) => {
  if (err) throw err;
  if (data != '') users = JSON.parse(data);
});
fs.readFile(path.join(__dirname, 'Data','sessions.json'), 'utf8', (err, data) => {
  if (err) throw err;
  if (data!= '') sessions = JSON.parse(data);
});

app.get('*', (req, res, next) => {
  if (req.cookies.sessionid) {
    let sessionFound = false;
    for (let session of sessions) {
      if (req.cookies.sessionid == session.id && req.ip == session.ip) {
        req.session = session; 
        sessionFound = true;
      }
    }
    if (!sessionFound) {
      res.clearCookie('sessionid');
      req.session = null;
    }
  } 
  else {
    req.session = null;
  }
  next()
});

// Blog managing --------------------------------

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname,'static','homePage.html'));
})

app.get('/blog/:id', (req,res) => {
  res.sendFile(path.join(__dirname,'static','blog.html'));
})

app.get('/get-blog-data/:id', (req,res) => {
  let blogData;
  for (let blog of blogs) {
    if (blog.id == req.params.id) blogData = JSON.stringify(blog);
  }
  res.send(blogData);
})

app.get('/create', (req, res) => {
  if (req.session == null) res.redirect('/login');
  else res.sendFile(path.join(__dirname,'static','create.html'));
})

// Login and signup ------------------------------

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,'static','login.html'));
})

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let correctData = false;
  for (let user of users) {
    if (user.email == email && user.password == password) {
      correctData = true;
      let sessionExists = false;
      let prevSession;
      for (let session of sessions) {
        if (session.email == email && session.ip == req.ip) {
          sessionExists = true;
          prevSession = session;
        }
      }
      let session;
      if (!sessionExists) {
        session = {firstName: user.firstName, lastName: user.lastName, email: user.email, id: generateUniqueSessionId(), ip: req.ip};
        sessions.push(session);
      }
      else {
        session = prevSession;
      }
      res.cookie('sessionid', session.id);
      saveData();
      res.redirect('/');
    }
  }
  if (!correctData) res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login</title>
      <link rel="stylesheet" href="/styles/login.css">
      <script src="/scripts/login.js" defer></script>
  </head>
  <body>
      <div class="scrollbar">
          <div class="progress"></div>
      </div>
      <header>
          <div class="headerTitle" data-link="./">Bloggs</div>
          <div class="navOptions">
              <div class="home" data-link="./">Home</div>
              <div class="discover" data-link="./discover">Discover</div>
              <div class="mission" data-link="./mission">Mission</div>
              <div class="about" data-link="./about">About</div>
              <div class="contact" data-link="./contact">Contact</div>
          </div>
          <div class="btns">
              <button class="createBlog" data-link="./create">Create a blog</button>
              <button class="login" data-link="./register">Register</button>
          </div>
      </header>
          <div class="loginSec">
              <div class="title">Log in</div>
              <div class="incorrectData show">Incorrect email or password!</div>
              <form action="/login" method="post">
                  <input required type="email" name="email" class="email" placeholder="Email">
                  <input required type="password" name="password" class="password" placeholder="Password">
                  <input required type="submit" value="Log in">
              </form>            
          </div>
          <div class="signupSec">
              <div class="title">New here?</div>
              <div class="desc">Create an account. And create something amazing!</div>
              <button data-link="./register" class="signupRedirect">Create an account</button>
          </div>
  </body>
  </html>`)
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname,'static','register.html'));
})

app.post('/register', (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let emailExists = false;
  for (let user of users) {
    if (user.email == email) emailExists = true;
  }
  let user
  if (!emailExists) {
    user = {firstName: firstName, lastName: lastName, email: email, password: password};
    users.push(user);
    saveData();
    res.redirect('/login');
  }
  else {res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Register</title>
      <link rel="stylesheet" href="/styles/register.css">
      <script src="/scripts/register.js" defer></script>
  </head>
  <body>
      <div class="scrollbar">
          <div class="progress"></div>
      </div>
      <header>
          <div class="headerTitle" data-link="./">Bloggs</div>
          <div class="navOptions">
              <div class="home" data-link="./">Home</div>
              <div class="discover" data-link="./discover">Discover</div>
              <div class="mission" data-link="./mission">Mission</div>
              <div class="about" data-link="./about">About</div>
              <div class="contact" data-link="./contact">Contact</div>
          </div>
          <div class="btns">
              <button class="createBlog" data-link="./create">Create a blog</button>
              <button class="login" data-link="./login">Log in</button>
          </div>
      </header>
          <div class="loginSec">
              <div class="title">Register</div>
              <div class="emailTaken show">Email already in use!</div>
              <form action="/register" method="post">
                  <input required type="text" name="firstName" class="firstName" placeholder="First name">
                  <input required type="text" name="lastName" class="lastName" placeholder="Last name">
                  <input required type="email" name="email" class="email" placeholder="Email">
                  <input required type="password" name="password" class="password" placeholder="Password">
                  <input required type="submit" value="Register" class="submit">
              </form>            
          </div>
          <div class="signupSec">
              <div class="title">Already a part of us?</div>
              <div class="desc">Log in a continue doing amazing things.</div>
              <button data-link="./login" class="signupRedirect">Log in</button>
          </div>
  </body>
  </html>`)}
});

app.get('/get-user' , (req, res) => {
  let data = {firstName:''}
  if (req.session != null) data = {firstName: req.session.firstName, lastName: req.session.lastName, email: req.session.email};
  res.send(JSON.stringify(data));
})
// ------------------------

app.listen(port,"0.0.0.0", () => {
  console.log(`Listening on port: ${port}`);
})

function generateUniqueBlogId() {
  let id = Math.round(Math.random() * 1000000000000000);
  for(let blog of blogs) {
    if(blog.id == id) {
      return generateUniqueBlogId();
    }
  }
  return id;
}

function generateUniqueSessionId() {
  let id = Math.round(Math.random() * 1000000000000000);
  for(let session of sessions) {
    if(session.id == id) {
      return generateUniqueSessionId();
    }
  }
  return id;
}

function saveData() {
  fs.writeFile(path.join(__dirname, 'Data', 'users.json'), JSON.stringify(users), (err) => {
    if (err) throw err;
  })
  fs.writeFile(path.join(__dirname, 'Data','sessions.json'), JSON.stringify(sessions), (err) => {
    if (err) throw err;
  })
}