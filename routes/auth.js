var express = require("express");
var router = express.Router();

var Content = require("./../models/Content");
var Admin = require("./../models/Admin");
var bcrypt = require("bcryptjs");

router.get("/admin", (req, res) => {
  // console.log(req.session.admin);
  // Content.remove({ type: "carrers" }, (err, s) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("removed successfully");
  //   }
  // });
  if (req.session.admin > 0) {
    res.redirect("/adminpanel");
  } else {
    res.render("login");
  }
});

router.post("/admin", (req, res) => {
  Admin.find({ email: req.body.email }, (err, admin) => {
    if (err) {
      console.log(err);
      res.redirect("/admin");
    } else {
      // console.log(admin);
      if (admin.length > 0) {
        var hash = admin[0].password;
        bcrypt.compare(req.body.pwd, hash, function(err, response) {
          // res == true
          if (response) {
            req.session.admin = 1;
            res.redirect("/adminpanel");
          } else {
            console.log("Please type the correct password");
            res.redirect("/admin");
          }
        });
      } else {
        res.redirect("/admin");
        console.log("No such user exists");
      }
    }
  });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  var error = 0;
  if (!req.body.email || !req.body.pwd || !req.body.rpwd) {
    // res.redirect('/signup');
    error++;
    console.log("please enter all fields");
  }
  if (req.body.pwd != req.body.rpwd) {
    error++;
    // res.redirect('/signup');
    console.log("Passwords do not match");
  }
  if (req.body.pwd.length < 6) {
    error++;
    // res.redirect('/signup');
    console.log("Password must be at least 6 characters");
  }
  if (error > 0) {
    res.redirect("/signup");
  } else {
    // res.send('Hello from the post route');
    // console.log(req.body);
    Admin.findOne({ email: req.body.email }).then(admin => {
      if (admin) {
        //       errors.push({ msg: 'Email already exists' });
        console.log("Email already exists");
        res.redirect("/signup");
        //       res.render('register', {
        //         errors,
        //         name,
        //         email,
        //         password,
        //         password2
        //       });
      } else {
        const newAdmin = new Admin({
          email: req.body.email,
          password: req.body.pwd
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin
              .save()
              .then(admin => {
                console.log("New Admin created successfully");
                res.redirect("/adminpanel");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.get("/adminpanel", (req, res) => {
  if (req.session.admin > 0) {
    var fs = require("fs");
    var files = fs.readdirSync(__dirname);
    files = files.filter(function(item) {
      return (
        item.includes("jpg") || item.includes("jpeg") || item.includes("png")
      );
    });
    Content.find({ type: "color" }, (err, cont) => {
      var colors;
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        colors = cont[0].content;
        // console.log(colors);
        var parentContent;
        Content.find({ type: "parent" }, (parenterr, parent) => {
          if (parenterr) {
            console.log(parenterr);
            res.redirect("/");
          } else {
            // console.log(parent);
            parentContent = parent[0].content;
            var carrersContent;
            Content.find({ type: "carrers" }, (carrererr, carrer) => {
              if (carrererr) {
                console.log(carrererr);
                res.redirect("/adminpanel");
              } else {
                // console.log(carrer[0].content);
                if (carrer.length == 0) {
                  carrer = [];
                  carrersContent = [];
                } else {
                  carrersContent = carrer[0].content;
                }
                var contactsContent;
                Content.find({ type: "contacts" }, (contacterr, contact) => {
                  if (contacterr) {
                    console.log(contacterr);
                    res.redirect("/adminpanel");
                  } else {
                    contactsContent = contact[0].content;
                    var teamContent;
                    Content.find(
                      { type: "teamMembers" },
                      (teamContenterr, team) => {
                        if (teamContenterr) {
                          console.log(teamContenterr);
                          res.redirect("/adminpanel");
                        } else {
                          // console.log(team[0].content);
                          teamContent = team[0].content;
                          var articleContent;
                          Content.find(
                            { type: "articles" },
                            (articleContenterr, article) => {
                              if (articleContenterr) {
                                console.log(articleContenterr);
                                res.redirect("/adminpanel");
                              } else {
                                // console.log(team[0].content);
                                articleContent = article[0].content;
                                res.render("adminpanel", {
                                  colors: colors,
                                  parent: parentContent,
                                  carrers: carrersContent,
                                  contacts: contactsContent,
                                  teamMembers: teamContent,
                                  articles: articleContent,
                                  files: files
                                });
                              }
                            }
                          );
                          // res.render('adminpanel',{colors:colors,parent:parentContent,carrers:carrersContent,contacts:contactsContent,teamMembers:teamContent});
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.redirect("/admin");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});

module.exports = router;
