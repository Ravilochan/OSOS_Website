var mongoose = require("mongoose");

var contentSchema = new mongoose.Schema({
  type: String,
  content: Object
});

var Content = mongoose.model("Content", contentSchema, "Content");

module.exports = Content;
