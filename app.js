const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const _ = require('lodash');
const mongoose= require('mongoose');
const port = process.env.PORT || 3000;

const app = express();

const uri = process.env.MONGODB_URI;

app.set('view engine', 'ejs');

// For Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// Mongoose Connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to todoDB");
});

// ToDo Item Schema
const Schema = mongoose.Schema;
const itemsSchema = new Schema ({
  name: String,
});

// ToDo Item Model
const Item = mongoose.model('Item', itemsSchema);

const welcome = new Item ({
  name: 'Welcome to Taskmaster - ToDo List'
});

const addItemHelp = new Item ({
  name: 'Hit the + button to add a new item.'
});

const deleteItemHelp = new Item ({
  name: '<-- Click the checkbox to delete an item.'
});

// Starting Items for How-To
const defaultItems = [welcome, addItemHelp, deleteItemHelp];

// Custom List schema
const listSchema = new Schema ({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

// Prevent favicon from creating new data
app.get('/favicon.ico', (req, res) => res.status(204));

// Render Home Route
app.get('/', (req, res) => {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Default Items have been added to Home Screen');
        }
      });
      res.redirect('/');
    } else {
      res.render('list', {listTitle: "Today", newListItems: foundItems});
    }
  });
});

// Get items from custom user generated list
app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  // Prevents the user from creating an about list collection, this will route to the /about page.
  List.findOne({name: customListName}, {}, (err, foundList) => {
    if (!err) {
      if (customListName === "About") {
        res.render("about");
      } else if (!foundList) {
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // show an existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });
});

// Posts new items to appropriate route
// New item is added to the database via Item Model.
app.post('/', (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });
// Home Route List
  if (listName === "Today") {
    item.save();
    res.redirect('/');
  } else {
    // Post to current custom list that user is in
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    });
  }
});

// Render About Me Page
app.get('/about', (req, res) => {
  res.render('about');
});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
      if (!err) {
        console.log("Successfully deleted checked item from custom list.")
        res.redirect('/' + listName);
      }
    });
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
