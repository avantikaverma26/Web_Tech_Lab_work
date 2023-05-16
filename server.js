const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sqlite = require('sqlite3').verbose();
let db = my_database('./myDB.db');

app.post("/photos", async (req, res) => {
  var data = {
    author: req.body.author,
    alt: req.body.alt,
    tags: req.body.tags,
    image: req.body.image,
    description: req.body.description,
  };
  var sql    = `INSERT INTO myPHOTOalbum (author, alt, tags, image, description) VALUES (?,?,?,?,?)`;
  var params = [data.author, data.alt, data.tags, data.image, data.description];
  db.run(sql, params, function (err, result) 
  {
    if (err) 
    {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "Success",
      data   : data
    });
  });
});

app.get('/photos', function(req, res) {
db.all(`SELECT * FROM  myPHOTOalbum `, function(err, rows) {
   if (err) 
    {
      res.status(400).json({ error: err.message });
      return;
    }
   else
   {
    // # Return db response as JSON
    return res.json(rows)
   }
  });
});

app.get("/photos/:id", (req, res, next) => {
  var sql = "SELECT * FROM  myPHOTOalbum where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
        // # Return db response as JSON
      res.json({
          "message":"Success",
          "data":row
      })
    });
});

app.patch("/photos/:id",  (req, res) => {
  var data = {
    author: req.body.author,
    alt: req.body.alt,
    tags: req.body.tags,
    image: req.body.image,
    description: req.body.description,
  };
  db.run(
    `UPDATE myPHOTOalbum set 
       author = COALESCE(?,author), 
       alt = COALESCE(?,alt), 
       tags = COALESCE(?,tags),
       image = COALESCE(?,image),
       description = COALESCE(?,description)
       WHERE id = ?`,
    [data.author, data.alt, data.tags, data.image, data.description, req.params.id],
    function (err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
          // # Return db response as JSON
        res.json({
            message: "Success",
            data: data,
            changes: this.changes
        })
});
});

app.delete("/photos/:id", (req, res) => {
	db.run(`DELETE  FROM myPHOTOalbum WHERE id = ?`, [req.params.id], function(err, rows) {
       if (err) 
       {
         res.status(400).json({ error: err.message });
         return;
       }
      else
      {
       // # Return db response as JSON
       res.json({
        message: "Successfully Deleted",
        id: req.params.id,
      });
      }
     });
  });


  app.put("/photos/:id",  (req, res) => {
    var data = {
      author: req.body.author,
      alt: req.body.alt,
      tags: req.body.tags,
      image: req.body.image,
      description: req.body.description,
    };
    db.run(
      `UPDATE myPHOTOalbum set 
         author = COALESCE(?,author), 
         alt = COALESCE(?,alt), 
         tags = COALESCE(?,tags),
         image = COALESCE(?,image),
         description = COALESCE(?,description)
         WHERE id = ?`,
      [data.author, data.alt, data.tags, data.image, data.description, req.params.id],
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
            // # Return db response as JSON
          res.json({
              message: "Success",
              data: data,
              changes: this.changes
          })
  });
  });



// #################################################################################
// This should start the server, after the routes have been defined, at port ) 3000:
// #################################################################################

console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/photos");
app.listen("3000", () => console.log("Server is running on port 3000"));


function my_database(filename) {
  // Conncect to db by opening filename, create filename if it does not exist:
  var db = new sqlite.Database(filename, (err) => {
   if (err) {
    console.error(err.message);
 }
 console.log('Connected to the Photo Database.');
});
// Create our myPHOTOalbum table if it does not exist already:
db.serialize(() => {
db.run(`
 CREATE TABLE IF NOT EXISTS myPHOTOalbum
 (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
author CHAR(100) NOT NULL,
alt CHAR(100) NOT NULL,
tags CHAR(256) NOT NULL,
image char(2048) NOT NULL,
description CHAR(1024) NOT NULL
 )
`);

db.all(`select count(*) as count from myPHOTOalbum`, function(err, result) {
if (result[0].count == 0) {
db.run(`INSERT INTO myPHOTOalbum (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`, 
[
 "Tim Berners-Lee",
 "Image of Berners-Lee",
 "html,http,url,cern,mit",
 "https://upload.wikimedia.org/wikipedia/commons/9/9d/Sir_Tim_Berners-Lee.jpg",
 "The internet and the Web aren't the same thing."
 ]);
db.run(`INSERT INTO myPHOTOalbum (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`,
 [
 "Grace Hopper",
 "Image of Grace Hopper at the UNIVAC I console",
 "programming,linking,navy",
 "https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg",
 `Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided to
determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she was doing (she was then
limited to one clock).`
 ]);
console.log('Inserted dummy photo entry into empty database');
} else {
console.log("Database already contains", result[0].count, " item(s) at startup.");
}
});
});
return db;
}