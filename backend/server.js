//Requiring the modules needed for the server.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongo = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//Creates new constructors.
var app = express();
const SALT_WORK_FACTOR = 10;
const port = 3000;
var user_id = '';
//Gets all the modules.
var plugins = require('./modules/plugins.js');

mongo.connect("mongodb://127.0.0.1/freecoders", function(err, db){
    plugins.getplugins(db);
    if(err) throw err;
    var codedb = db.collection('freecoders');
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
//View engine
app.set('view engine', 'ejs');
//Specify folder we want to use
app.use(express.static(path.join(__dirname, '../pages/css')));
app.set('views', path.join(__dirname, '../views'));
//Body parser middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Express session middleware.
app.use(cookieParser());
app.use(session({
    secret: 'cloud' //This is the secret for the session. Change later...
}));


//Handle a get request.
app.get('/', function(req, res){
    //Renders the login page.
    
    console.log('Someone visisted our page..');
    res.render('index', {
        title: 'FreeCoders', //Passing the title and the current user's id.
        user: user_id
    });
});

//If a request to the login page.
app.get('/login', function(req, res){
    res.render('login', {
        title: 'FreeCoders',
    });
});

//If we get an request for the plugins page.
app.get('/plugins', function(req, res){
    //Get the plugins from the other module's result. (Get it again)
    plugins.getplugins(db);

    //Creates variable for receivePlugins
    var receivePlugins = plugins.result; 
    //console.log(receivePlugins);
    
    res.render('plugins', {
        user: user_id,
        data: JSON.stringify(receivePlugins)
    });
    
});
app.get('/index', function(req, res){
    res.render('index', {
        user: user_id
    });
});

//Catch Submition
app.post('/users/add', function(req, res){
    console.log('Signup form submitted');

    //Converts all the recieved information into string and better variables.
    var newUser = req.body.signupusr;
    var newEmail = req.body.signupemail;
    var newPwd = req.body.signuppwd;

    //Hashing the password and place it into the database.
    var hash = bcrypt.hashSync(newPwd, salt);
    newPwd = hash;
    console.log(newPwd);
    //Checks if the fields are empty or not.
    if(newUser != "" && newEmail != "" && newPwd != ""){

        //Inserts it into the correct database.
    codedb.insert({user: newUser, email: newEmail, password: newPwd});
    console.log('A user signed up with the username ' + newUser + ' with the email ' + newEmail);
    console.log('Hashed the password: ' + newPwd);
    } else {
        console.log('Someone tried to signup with an empty field!'); //Logs that someone tried to signup with an empty field.
    }
    
});
//If we get a post request that we want to login. 
//The code gets a bit more complicated from now on...
app.post('/users/login', function(req, res){
    console.log('Someoned tried to sign in.');
    //Sets up temp variables from the input we've gotten from the clients.
    var usr = req.body.usr;
    var pwd = req.body.pwd;
    //Finds if user exists in the Database
    codedb.findOne({user: usr}, function(err, result){
        if (err) throw err;
        //If we get a result in the database then do this.
        if(result != null){
            //Comparing the password to fit the database.
             bcrypt.compare(pwd, result.password, function(err, response){
                if(err) throw err;
                if(response == true){
                    //If we are logged in to the site.
                    console.log('Someone successfully logged into the website. The username is: ' + usr);
                    //Sets up a new sessions & variables
                    user_id = usr;
                    req.session.userName = user_id;
                    console.log(user_id);
                    res.redirect('/');

                } else {
                    //OOPS, wrong password :///
                    console.log(usr + ' tried to login with the wrong password.');
                }
             });
             
        } else {
            console.log('Somone tried to login with a false username.');
        }
    });

});


//Listen for incooming connections on the port (3000)
app.listen(port, function(){
console.log('Server Running on port 3000');
});
});
