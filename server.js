const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const session = require('express-session');
const salt = bcrypt.genSaltSync(10);
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('static'));

app.use(session({
  secret: "3aa41d45a81cf97ec6bf9880162401892c580c2260b36074b506bd7f4678cbb3",
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false }
}))

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

app.get('*', (req, res, next) => {
  next()
});

// Blog managing --------------------------------

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname,'static','/home/homePage.html'));
})

app.get('/blog/:id', (req,res) => {
  res.sendFile(path.join(__dirname,'static','/blog/blog.html'));
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
  else res.sendFile(path.join(__dirname,'static','/create/create.html'));
})

app.get('/get-recent-blogs', (req, res) => {
  let numOfBlogs = blogs.length;
  if (numOfBlogs > 6) numOfBlogs = 6;
  const blogsPackage = [];
  for (let i = 0; i < numOfBlogs; i++) {
    blogsPackage.push(blogs[blogs.length - 1 - i]);
  }
  res.json(blogsPackage);
})

app.post('/post-blog', (req, res) => {
  const blogData = req.body;
  blogData.id = generateUniqueBlogId();
  for (let user of users) {
    if (user.email === blogData.ownerEmail) {
      user.ownedBlogs.push(blogData.id);
    }
  }
  blogs.push(blogData);
  saveData();
})

// Profiles pages

app.get('/profile/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', '/profile/profile.html'));
})

app.get('/get-profile/:id', (req, res) => {
  let data = "404 NOT FOUND";
  for (let user of users) {
    console.log(user);
    if (user.id == req.params.id) {
      data = {id: user.id, firstName: user.firstName, lastName: user.lastName, ownedBlogs: user.ownedBlogs, likedBlogs: user.likedBlogs, favouriteBlogs: user.favouriteBlogs }
    }
  } 
  console.log(req.params.id, data);
  res.json(JSON.stringify(data));
})

// Login and signup ------------------------------

app.get('/login', (req, res) => {
  if (req.session.user) res.redirect("/");
  else res.sendFile(path.join(__dirname,'static','/login/login.html'));
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
    res.redirect('/');
  } else res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login</title>
      <link rel="stylesheet" href="/login/login.css">
      <script src="/login/login.js" defer></script>
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
  if (req.session.user) res.redirect("/");
  else res.sendFile(path.join(__dirname,'static','/register/register.html'));
})

app.post('/register', async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let hashPass = await bcrypt.hash(password, salt);
  console.log(password, hashPass);
  let emailExists = false;
  for (let user of users) {
    if (user.email == email) emailExists = true;
  }
  let user
  if (!emailExists) {
    user = {id: generateUniqueUserId (),firstName: firstName, lastName: lastName, email: email, password: hashPass, ownedBlogs: [], likedBlogs: [], favouriteBlogs: [], comments: []};
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
      <link rel="stylesheet" href="/register/register.css">
      <script src="/register/register.js" defer></script>
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
  if (req.session.user != null) data = {firstName: req.session.user.firstName, lastName: req.session.user.lastName, email: req.session.user.email};
  res.send(JSON.stringify(data));
})

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error logging out');
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});
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

function generateUniqueUserId() {
  let id = Math.round(Math.random() * 1000000000000000);
  for (let user of users) {
    if (user.id == id) return generateUniqueUserId();
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

//3aa41d45a81cf97ec6bf9880162401892c580c2260b36074b506bd7f4678cbb3