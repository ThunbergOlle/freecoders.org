//Requiring the modules needed for the server.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongo = require('mongodb').MongoClient;
//Creates new express
var app = express();
const port = 3000;

mongo.connect("mongodb://127.0.0.1/freecoders", function(err, db){
    if(err) throw err;
    let codedb = db.collection('freecoders');
//View engine
app.set('view engine', 'ejs');
//Specify folder we want to use
app.use(express.static(path.join(__dirname, '../pages/css')));
app.set('views', path.join(__dirname, '../views'));
//Body parser middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Place to put static resources & paths


//Handle a get request.
app.get('/', function(req, res){
    //Renders the login page.
    res.render('login', {
        title: 'FreeCoders'
    });
})
//Catch Submition
app.post('/users/add', function(req, res){
    console.log('Signup form submitted');

    //Converts all the recieved information into string and better variables.
    var newUser = req.body.signupusr;
    var newEmail = req.body.signupemail;
    var newPwd = req.body.signuppwd;

    //Checks if the fields are empty or not.
    if(newUser != "" && newEmail != "" && newPwd != ""){

        //Inserts it into the correct database.
    codedb.insert({user: newUser, email: newEmail});
    console.log('A user signed up with the username ' + newUser + ' with the email ' + newEmail);
    } else {
        console.log('Someone tried to signup with an empty field!'); //Logs that someone tried to signup with an empty field.
    }
    
});

//Listen for incooming connections on the port (3000)
app.listen(port, function(){
console.log('Server Running on port 3000');
});
});
