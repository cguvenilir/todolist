//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

const config = require('./config/config.js');
var url = global.gConfig;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to your To-do List!"
});

const item2 = new Item ({
  name: "Type a new item and press the 'Add' button."
});

const item3 = new Item ({
  name: "<-- Click here to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);
var listNames;


app.get("/", function(req, res) {
  List.find({}, function (err, lists){
    if (!err) {
      listNames = lists;
      res.render("home", {listTitle: listNames});
    }
  });
});


app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, list){
      if (!err) {
        res.render("list", {listTitle: customListName, newListItems: list.items});
      };
  });
});


app.post("/:customListName", function(req,res){
  const itemName = req.body.newItem;
  const customListName = req.params.customListName;
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  const deleteList = req.body.deleteList;

  const item = new Item ({
    name: itemName
  });

  if (customListName !== "delete") {
    List.findOne({name: customListName}, function(err, list){
      list.items.push(item);
      list.save();
      res.redirect("/" + customListName);
    });
  } else if (customListName === "delete"){
      if (listName === "choose") {
        List.deleteOne({name: deleteList}, function(err, list){
          if (!err){
            res.redirect("/");
          }
        });
      } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, list){
          if (!err) {
            res.redirect("/" + listName);
          }
        });
      };
    };
});


app.post("/", function(req, res){
  const newListName = _.capitalize(req.body.newList);

  List.findOne({name: newListName}, function(err, list){
    if(!err){
      if(!list){
        const list = new List({
          name: newListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + newListName);
      } else {
        res.render("list", {listTitle: newListName, newListItems: newListName.items});
      }
    }
  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port && 3000, function() {
  console.log("Server started successfully");
});
