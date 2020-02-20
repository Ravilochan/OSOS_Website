// Declarations
var express = require("express")
app = express();
var methodOverride = require("method-override")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
app.set("view engine", "ejs");
const { convertDeltaToHtml } = require('node-quill-converter');

// DB Connection
// mongoose.connect("mongodb://localhost:27017/web5");
const db =
  "mongodb+srv://vamsi:vamsi@123@cluster0-sb3ge.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.fieldname == "photo") {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    console.log("not the required feildname");
  }
};

// Initialising Multer Storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

var Content = require("./models/Content");

var Admin = require("./models/Admin");
var AuthRouter = require("./routes/auth");
var changeAdminPanelRouter = require("./routes/adminpanel");
var removeRouter = require("./routes/remove");

const publicDirectoryPath = path.join(__dirname, "/public");
app.use(session({ secret: "keyboard cat" }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

app.set("view engine", "ejs");
app.use(express.static(publicDirectoryPath));
app.use("/", changeAdminPanelRouter);
app.use("/", removeRouter);
app.use("/", AuthRouter);

// app.use(express.static("/public"));
app.use(methodOverride("_method"));

app.post("/upload", upload.single("photo"), (req, res) => {
  if (req.file) {
    res.redirect("/adminpanel");
  } else throw "error";
});


//change in multer
// app.post("/upload", upload.array('photo', 10), (req, res) => {
//   if (req.file) {
//     // res.json(req.file);
//     res.redirect("/adminpanel");
//   } else throw "error";
// });

// app.post("/addmember", (req, res) => {
//   Content.find({ type: "teamMembers" }, (err, cont) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/adminpanel");
//     } else {
//       // console.log(cont);
//       if (cont.length == 0) {
//         // console.log(x);
//         var x = {
//           Name: req.body.memName,
//           Position: req.body.memPosition,
//           About: req.body.memInfo,
//           Image: req.body.memImg
//         };
//         var content = [];
//         content.push(x);
//         // console.log(content);
//         Content.create({
//           type: "teamMembers",
//           content: content
//         });
//         console.log("if part");
//         res.redirect("/adminpanel");
//       } else {
//         console.log("else part");
//         // res.redirect('/adminpanel');
//         var newmember = {
//           Name: req.body.memName,
//           Position: req.body.memPosition,
//           About: req.body.memInfo,
//           Image: req.body.memImg
//         };
//         var newcarrercont = cont[0];
//         // console.log(newcarrercont.content);
//         newcarrercont.content.push(newmember);
//         // console.log(newcarrercont);
//         Content.updateOne({ type: "teamMembers" }, newcarrercont, function (
//           err,
//           newContent
//         ) {
//           if (err) {
//             console.log(err);
//             res.redirect("/adminpanel");
//           } else {
//             console.log("updated successfully");
//             res.redirect("/adminpanel");
//           }
//         });
//         // res.redirect('/adminpanel')/
//       }
//     }
//   });
// });

app.post("/addarticle", (req, res) => {
  Content.find({ type: "articles" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/adminpanel");
    } else {
      // console.log(cont);
      if (cont.length == 0) {
        var x = {
          Name: req.body.articleName,
          data: req.body.delta,
          
        };
        var content = [];
        content.push(x);
        // console.log(content);
        Content.create({
          type: "articles",
          content: content
        });
        console.log("if part");
        res.redirect("/adminpanel");
      } else {
        console.log("else part");
        // res.redirect('/adminpanel');
        const { convertDeltaToHtml } = require('node-quill-converter');
        var newArticle = {
          Name: req.body.articleName,
          data: req.body.delta,
          
        };
        // let html=convertDeltaToHtml(req.body.delta)
        // console.log(JSON.stringify(newArticle.data))
        var newarticlecont = cont[0];
        newarticlecont.content.push(newArticle);
        // console.log(newarticlecont)
        newarticle = newarticlecont.content.map((x, i) => {
          x.id = i + 1
          return x
        })
        // console.log(newarticle)
        Content.updateOne({ type: "articles" }, newarticlecont, function (
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

app.get("/past", (req, res) => {
  var colors;
  Content.find({ type: "color" }, (err, cont) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      colors = cont[0].content;
      // console.log(colors);
      var parentContent;
      Content.find({ type: "parent" }, (parenterr, parent) => {
        if (err) {
          console.log(parenterr);
          res.redirect("/");
        } else {
          // console.log(parent);
          parentContent = parent[0].content;
          var carrersContent;
          Content.find({ type: "carrers" }, (carrererr, carrer) => {
            if (carrererr) {
              console.log(carrererr);
              res.redirect("/");
            } else {
              // console.log(carrer[0].content);
              carrersContent = carrer[0].content;
              var contactsContent;
              Content.find({ type: "contacts" }, (contacterr, contact) => {
                if (contacterr) {
                  console.log(contacterr);
                  res.redirect("/");
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
                              res.render("index-past", {
                                colors: colors,
                                parent: parentContent,
                                carrers: carrersContent,
                                contacts: contactsContent,
                                teamMembers: teamContent,
                                articles: articleContent
                              });
                            }
                          }
                        );
                        // res.render('adminpanel',{colors:colors,parent:parentContent,carrers:carrersContent,contacts:contactsContent,teamMembers:teamContent});
                      }
                    }
                  );
                  // res.render('index',{colors:colors,parent:parentContent,carrers:carrersContent,contacts:contactsContent});
                }
              });
              // res.render('index',{colors:colors,parent:parentContent,carrers:carrersContent});
            }
          });
        }
      });
      // console.log('hii'+colors);
    }
  });
  // console.log(colors);
});
//previous article
app.get("/articles", (req, res) => {
  Content.find({ type: "color" }, (err, cont) => {
    var colors;
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      // console.log(cont)
      colors = cont[0].content;
      var articleContent;
      Content.find({ type: "articles" }, (articleContenterr, article) => {
        if (articleContenterr) {
          console.log(articleContenterr);
          res.redirect("/adminpanel");
        } else {
          articleContent = article[0].content;

          res.render("articles", { colors: colors, articles: articleContent });
        }
      });
    }
  });
});
//v2
app.get("/blogs/:id", (req, res) => {
  var id = req.params.id;
  var articleContent;
  Content.find({ type: "articles" }, (articleContenterr, article) => {
    if (articleContenterr) {
      console.log(articleContenterr);
      res.redirect("/adminpanel");
    } else {
      articleContent = article[0].content;
      no = articleContent.length;
      sendarticles = articleContent.reverse();
      sendarticles = articleContent.slice(id - 1, id);
      if (articleContent.length < 5) {
        full = articleContent;
        // console.log(full);
      } else {
        full = articleContent.slice(0, 5);
      }
      res.render("blogs", {
        articles: sendarticles,
        full: full,
        no: no,
        id: id
      });
    }
  });
});
// Version 1
app.get("/team", (req, res) => {
  Content.find({ type: "color" }, (err, cont) => {
    var colors;
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      colors = cont[0].content;
      var teamContent;
      Content.find({ type: "teamMembers" }, (teamContenterr, team) => {
        if (teamContenterr) {
          console.log(teamContenterr);
          res.redirect("/adminpanel");
        } else {
          // console.log(team[0].content);
          teamContent = team[0].content;
          // console.log(teamContent);
          res.render("team", { colors: colors, members: teamContent });
        }
      });
    }
  });
});
// v1
app.get("/fetch/team", (req, res) => {
  var teamContent;
  Content.find({ type: "teamMembers" }, (teamContenterr, team) => {
    if (teamContenterr) {
      console.log(teamContenterr);
      res.redirect("/adminpanel");
    } else {
      // console.log(team[0].content);
      teamContent = team[0].content;
      // console.log(teamContent);
      res.send(teamContent);
    }
  });
});
// v1
app.post("/editmember/:id", (req, res) => {
  var teamContent;
  Content.find({ type: "teamMembers" }, (teamContenterr, team) => {
    if (teamContenterr) {
      console.log(teamContenterr);
      res.redirect("/adminpanel");
    } else {
      teamContent = team[0].content;
      var index;
      for (var i = 0; i < teamContent.length; i++) {
        if (teamContent[i].Name == req.params.id) {
          index = i;
        }
      }
      // console.log(teamContent);
      // console.log(index);
      var x = {
        Name: req.body.memName,
        Position: req.body.memPosition,
        About: req.body.memInfo,
        Image: req.body.memImg
      };
      // // console.log(x);
      teamContent[index] = x;
      var newTeam = {
        type: "teamMembers",
        content: teamContent
      };
      Content.updateOne({ type: "teamMembers" }, newTeam, (err, success) => {
        if (err) {
          console.log(err);
          res.redirect("/adminpanel");
        } else {
          console.log("updating successful");
          res.redirect("/adminpanel");
        }
      });
      // res.redirect('/adminpanel');
    }
  });
});

app.get("/", (req, res) => {
  var parentContent;
  Content.find({ type: "parent" }, (parenterr, parent) => {
    if (parenterr) {
      console.log(parenterr);
      res.redirect("/");
    } else {
      parentContent = parent[0].content;
      var carrersContent;
      Content.find({ type: "carrers" }, (carrererr, carrer) => {
        if (carrererr) {
          console.log(carrererr);
          res.redirect("/");
        } else {
          carrersContent = carrer[0].content;
          var contactsContent;
          Content.find({ type: "contacts" }, (contacterr, contact) => {
            if (contacterr) {
              console.log(contacterr);
              res.redirect("/");
            } else {
              contactsContent = contact[0].content;
              res.render("index", {
                parent: parentContent,
                carrers: carrersContent,
                contacts: contactsContent
              });
            }
          });
        }
      });
    }
  });
});

app.get("/career", (req, res) => {
  var carrersContent;
  Content.find({ type: "carrers" }, (carrererr, carrer) => {
    if (carrererr) {
      console.log(carrererr);
      res.redirect("/");
    } else {
      // console.log("length")
      // console.log(carrer[0].content.length);
      carrersContent = carrer[0].content;
      // console.log(carrersContent.length)
      res.render("career", { carrers: carrersContent });
    }
  });
});

app.get("/socialmedia", (req, res) => {
  res.render("socialmedia");
});

const Storage1 = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, callback) => {
    callback(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const uploadresume = multer({
  storage: Storage1
}).single("Resume");

app.post("/uploadresume", (req, res) => {
  uploadresume(req, res, err => {
    if (err) {
      console.log(err);
      var carrersContent;
      Content.find({ type: "carrers" }, (carrererr, carrer) => {
        if (carrererr) {
          console.log(carrererr);
          res.redirect("/");
        } else {
          carrersContent = carrer[0].content;
          res.render("career", { carrers: carrersContent, msg: err });
        }
      });
    } else {
      console.log(req.file);
      var carrersContent;
      Content.find({ type: "carrers" }, (carrererr, carrer) => {
        if (carrererr) {
          console.log(carrererr);
          res.redirect("/");
        } else {
          custMailSendClient(req.body.email, req.body);
          custMailSend("contactus@osostechnologies.com", req.file, req.body);

          carrersContent = carrer[0].content;
          res.render("career", {
            carrers: carrersContent,
            msg:
              " Your application has been submitted. You will hear back from us. "
          });
        }
      });
    }
  });
});
function custMailSend(email, f, b) {
  console.log("CustMailsending...");
  var transporter = nodemailer.createTransport({
    service: "Godaddy",
    host: "smtpout.secureserver.net",
    secureConnection: false,
    port: 465,
    auth: {
      user: "contactus@osostechnologies.com",
      pass: "Tech@123"
    }
  });
  var mailOptions = {
    from: "contactus@osostechnologies.com",
    to: email,
    subject: "New Job Application",
    html:
      `Name : ` +
      b.Firstname +
      " " +
      b.Lastname +
      `<br>Email :` +
      b.email +
      `<br>Position :` +
      b.Position +
      `<br><br> Cover Letter :` +
      b.coverletter +
      "<p>Submitted Resume :</p>",
    attachments: [
      {
        // file on disk as an attachment
        filename: f.filename,
        path: f.path // stream this file
      }
    ]
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to OSOS");
    }
  });
}
function custMailSendClient(email, body) {
  var transporter1 = nodemailer.createTransport({
    service: "Godaddy",
    host: "smtpout.secureserver.net",
    secureConnection: true,
    port: 465,
    auth: {
      user: "contactus@osostechnologies.com",
      pass: "Tech@123"
    }
  });

  var mailOptions1 = {
    from: "contactus@osostechnologies.com",
    to: email,
    subject: "Your Application is Received ",
    html:
      `<h3> </h3>

      <p> Thank You for your interest in the following job opening <strong>` +
      body.Position +
      `</strong> at OSOS Private LTD. Your details have been successfully shared with our recruiting team at<strong> OSOS Private LTD.</strong>.<br><p>
      Our team will thoroughly review your application. We will connect with you soon. Thank you again for considering OSOS Private LTD. All the best.</p><br>
      <p style="text-align:left">Thanking you<br><span>Team OSOS</span></p>
      <blockquote> Note : This is a automated reply. Please don't Reply to this mail. </blockquote>`
  };
  transporter1.sendMail(mailOptions1, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Client Email sent");
      //   custMailSend(email);
    }
  });
}

app.get("/contact", (req, res) => {
  var contactsContent;
  Content.find({ type: "contacts" }, (contacterr, contact) => {
    if (contacterr) {
      console.log(contacterr);
      res.redirect("/");
    } else {
      contactsContent = contact[0].content;
      res.render("contact", { contacts: contactsContent });
    }
  });
});

app.get("/social", (req, res) => {
  res.render("social");
});

app.get("/enter", (req, res) => {
  res.render("enter");
});




app.listen(process.env.PORT || 9007, function () {
  console.log("Server Started at 9007");
});



