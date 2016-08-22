var express = require('express');
var Busboy = require('busboy');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test6');
var conn = mongoose.connection;
console.log(conn.db);
var fs = require('fs');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var app = express();
conn.once('open', function() {
  var gfs = Grid(conn.db);
  var mongojs = require('mongojs')
var db = mongojs('test6', ['fs.files','fs.chunks'])

  app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/getImage',function(req,res){
  console.log("checking the db")
   db.fs.files.find(function(err,docs){
      res.json(docs)
   });
});


  app.post('/file', function(req, res) {
    // fs.writeFile("/home/irisindpc2/sites/Grid-Fs/test.txt", JSON.stringify(req.headers), function(err) {
    //   console.log("JSON.stringify(req.headers)",JSON.stringify(req.headers))
    //   if (err) {
    //     return console.log(err);
    //   }
    //   console.log("The file was saved!");
    // });
    console.log('req.headers', req.headers);

    var busboy = new Busboy({
      headers: req.headers
    });
    console.log('busboy', busboy)
    var fileId = mongoose.Types.ObjectId();
    console.log('fileId', fileId)
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

      console.log('got file', filename, mimetype, encoding);
      var writeStream = gfs.createWriteStream({
        _id: fileId,
        filename: filename,
        mode: 'w',
        content_type: mimetype,
        name: "rahul"
      });
      console.log("file", file);
      console.log("writeStream", writeStream)
      file.pipe(writeStream);
    })

    .on('finish', function() {
      res.writeHead(200, {
        'content-type': 'text/html'
      });
      res.end('<p>File Uploaded Sucessfully </p><br>' + fileId.toString() + '<a href="/download/' + fileId.toString() + '">Download file </a>');
    });

    req.pipe(busboy);


  });
  
  // app.get('/download/:id', function(req, res) {
  //   gfs.findOne({
  //     _id: req.params.id
  //   }, function(err, file) {
  //     console.log(file);
  //     // if (err) return res.(400).send(err);
  //     // if (!file) return res.status(404).send('');

  //     // res.set('Content-Type', file.contentType);
  //     // res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
  //     // status
  //     var readstream = gfs.createReadStream({
  //       _id: file._id
  //     });

  //     readstream.on("error", function(err) {
  //       console.log("Got error while processing stream " + err.message);
  //       res.end();
  //     });

  //     readstream.pipe(res);
  //   });
  // });

});

// app.get('/', function (req, res) {
//   res.sendFile('index.html');
// });

// app.get('/', function(req, res) {
//   res.writeHead(200, {
//     'content-type': 'text/html'
//   });
//   res.end(
//     '<form action="/file" enctype="multipart/form-data" method="post">' +
//     '<input type="file" name="file"><br>' +
//     '<input type="submit" value="Upload">' +
//     '</form>'
//   );
// });


app.listen(4000);
console.log('Server running at http://localhost:4000/');