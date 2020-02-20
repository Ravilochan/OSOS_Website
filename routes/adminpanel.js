var express = require("express");
var router = express.Router();

var Content = require("./../models/Content");

router.post("/colorchange", (req, res) => {
  Content.find({ type: "color" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/adminpanel");
    } else {
      if (cont.length == 0) {
        Content.create({
          type: "color",
          content: {
            navcolor: req.body.navcolor,
            para1color: req.body.para1color,
            teamcolor: req.body.teamcolor,
            articlescolor: req.body.articlescolor,
            socialcolor: req.body.socialcolor
          }
        });
        res.redirect("/adminpanel");
        console.log("nothing exists");
      } else {
        console.log("something exists");
        var updated = {
          type: "color",
          content: {
            navcolor: req.body.navcolor,
            para1color: req.body.para1color,
            teamcolor: req.body.teamcolor,
            articlescolor: req.body.articlescolor,
            socialcolor: req.body.socialcolor
          }
        };
        Content.updateOne({ type: "color" }, updated, function(
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
    }
  });
});

router.post("/changeparent", (req, res) => {
  Content.find({ type: "parent" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/adminpanel");
    } else {
      if (cont.length == 0) {
        Content.create({
          type: "parent",
          content: {
            title: req.body.title,
            content: req.body.content,
            content2: req.body.content2,
            content3: req.body.content3,
            content4: req.body.content4,
            image: req.body.img
          }
        });
        res.redirect("/adminpanel");
      } else {
        var updated = {
          type: "parent",
          content: {
            title: req.body.title,
            content: req.body.content,
            content2: req.body.content2,
            content3: req.body.content3,
            content4: req.body.content4,
            image: req.body.img
          }
        };
        Content.updateOne({ type: "parent" }, updated, function(
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
      // res.redirect('/adminpanel');
    }
  });
});

router.post("/changecarrers", (req, res) => {
  // console.log(req.body.carrertitle);
  Content.find({ type: "carrers" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/adminpanel");
    } else {
      // console.log(cont[0].content.length);
      // res.redirect('/adminpanel');
      if (cont.length == 0) {
        var x = [];
        var y = {
          id:req.body.carrerid,
          title: req.body.carrertitle,
          requirements: req.body.carrerreq,
          addinfo: req.body.carrerinfo
        };
        x.push(y);
        // console.log(x);
        Content.create({
          type: "carrers",
          content: x
        });
        res.redirect("/adminpanel");
      } else {
        console.log("else part");
        // res.redirect('/adminpanel');
        var newcarrer = {
          id:req.body.carrerid,
          title: req.body.carrertitle,
          requirements: req.body.carrerreq,
          addinfo: req.body.carrerinfo
        };
        //     var newtitle=req.body.carrertitle;
        var newcarrercont = cont[0];
        var carrerAlreadyExists = false;
        // cont.forEach(content=>{
        //   if(content.title==req.body.carrertitle){
        //     carrerAlreadyExists=true;
        //   }
        // })
        for (var i = 0; i < cont.length; i++) {
          if (cont[i].title == req.body.carrertitle) {
            carrerAlreadyExists = true;
          }
        }
        if (carrerAlreadyExists) {
          console.log("already exists");
          res.redirect("/adminpanel");
        } else {
          newcarrercont.content.push(newcarrer);
          // console.log(newcarrercont);
          newcareer =  newcarrercont.content.map((y, i) => {
            y.id = i + 1
            return y
          })
          Content.updateOne({ type: "carrers" }, newcarrercont, function(
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
      }
      // res.redirect('/adminpanel');
    }
  });
});

router.post("/changecontact", (req, res) => {
  console.log(req.body);
  Content.find({ type: "contacts" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/adminpanel");
    } else {
      // console.log(cont);
      if (cont.length == 0) {
        Content.create({
          type: "contacts",
          content: {
            Email: req.body.contemail,
            Number: req.body.contNum,
            Website: req.body.contwebsite,
            Address: req.body.contaddress
          }
        });
        // console.log('if part');
        res.redirect("/adminpanel");
      } else {
        console.log("else part");
        // res.redirect('/adminpanel');
        var updated = {
          type: "contacts",
          content: {
            Email: req.body.contemail,
            Number: req.body.contNum,
            Website: req.body.contwebsite,
            Address: req.body.contaddress
          }
        };
        Content.updateOne({ type: "contacts" }, updated, function(
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
      // res.redirect('/adminpanel');
    }
  });
  // res.redirect('/adminpanel');
});

module.exports = router;
