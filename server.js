var express = require('express');
var router = express.Router();
var app = express();
var fs = require("fs");
var port = process.env.PORT || 8080;
var multer  = require('multer');
var path = require('path');
var functions = require('./js/functions')

//Variables
var path = __dirname + '/views/';
var OCRText = [];
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var ext = require('path').extname(file.originalname);
        ext = ext.length>1 ? ext : "." + require('mime').extension(file.mimetype);
        require('crypto').pseudoRandomBytes(16, function (err, raw) {
            cb(null, (err ? undefined : raw.toString('hex') ) + ext);
        });
    }
});
var upload = multer({storage: storage});

app.use(express.static("views"));

//Viewed at Localhost:8080/
// app.get('/',function(req,res){
//     res.sendFile(path + 'blank.html');    
// });

app.post('/file_upload', upload.single('Image'), function (req,res,err) {    
    console.log(req.file);
    var imgLocation = req.file.path
    var imagePath = __dirname + '/' + imgLocation;
    //res.sendFile(__dirname + '/'+ imgLocation);
    app.get('/image',function(req,res) {
        var img = fs.readFileSync(imagePath);
        res.writeHead(200,{'Content-Type': 'image/png'});
        res.end(img,'png');
    })
    res.sendFile(path+ 'index.html');
    functions.RunTesseract(req);
});

app.get('/retrive', function(req,res){
    res.download('./audio/Text.mp3');
})

app.listen(port);
console.log('The server is running on: ' + port);