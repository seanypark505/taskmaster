const express = require('express');
const bodyParser = require('body-parser');
const date = require('./date.js');
const port = process.env.PORT || 3000;

const app = express();

// Array of List Items
const items = [];
const workItems = [];

app.set('view engine', 'ejs');

// For Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// Display's Local Date and Time by using date.js module calling getDate function
app.get('/', (req, res) => {
  const day = date.getDate();
  res.render('list', {listTitle: day, newListItems: items});
});

// Directs to appropriate Home or Work Route depending on type of List
app.post('/', (req, res) => {
  const item = req.body.newItem;
  if (req.body.list === 'Work') {
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

// Get items from Work Route
app.get('/work', (req, res) => {
  const day = date.getDay();
  res.render('list', {listTitle: day + " Work List", newListItems: workItems});
});

// Post items form Work Route
app.post('/work', (req, res) => {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect('/work');
});

// Render About Me Page
app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(port, () => console.log(`Server started on port ${port}`));
