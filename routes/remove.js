var express = require("express");
var router = express.Router();

var Content = require("./../models/Content");

router.post("/removeMember/:id", (req, res) => {
  Content.find({ type: "teamMembers" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/adminpanel");
    } else {
      // res.send(req.params.id);
      // var names=[];
      var teamArr = cont[0].content;
      teamArr = teamArr.filter(function(item) {
        return item.Name != req.params.id;
      });
      // console.log(teamArr);
      var obj = {
        type: "teamMembers",
        content: teamArr
      };
      Content.updateOne({ type: "teamMembers" }, obj, function(
        err,
        newContent
      ) {
        if (err) {
          console.log(err);
          res.redirect("/adminpanel");
        } else {
          console.log("updated successfully");
          res.redirect("/adminpanel");
        }
      });
    }
  });
});

router.post("/removeArticle/:id", (req, res) => {
  Content.find({ type: "articles" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/adminpanel");
    } else {
      // res.send(req.params.id);
      // var names=[];
      // console.log(cont)
       var articleArr = cont[0].content;
      // console.log(articleArr)
        articleArr = articleArr.filter(function(item) {
          return item.id != req.params.id;
        });
        // console.log(teamArr);
        var obj = {
          type: "articles",
          content: articleArr
        };
        Content.updateOne({ type: "articles" }, obj, function(err, newContent) {
          if (err) {
            console.log(err);
            res.redirect("/adminpanel");
          } else {
            // console.log(newContent)
            console.log("deleted successfully");
            res.redirect("/adminpanel");
          }
        });
    }
  });
});

router.post("/removeCarrer/:id", (req, res) => {
  console.log(req.params);
  Content.find({ type: "carrers" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/adminpanel");
    } else {
      // var names=[];
      var carrerArr = cont[0].content;
      // res.send(req.params.id)
      carrerArr = carrerArr.filter(function(item) {
        return item.id != req.params.id;
      });
      console.log(carrerArr);
      // // console.log(teamArr);
      var obj = {
        type: "carrers",
        content: carrerArr
      };
      Content.updateOne({ type: "carrers" }, obj, function(err, newContent) {
        if (err) {
          console.log(err);
          res.redirect("/adminpanel");
        } else {
          // console.log(newContent)
          console.log("deleted career successfully");
          res.redirect("/adminpanel");
        }
      });
    }
  });
});

module.exports = router;
