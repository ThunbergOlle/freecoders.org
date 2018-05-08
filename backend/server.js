//Requiring the modules needed for the server.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongo = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const colors = require('colors');
//Creates new constructors.

var app = express();
const SALT_WORK_FACTOR = 10;
const port = 3000;
console.log('MODULES: OK'.green);
//Gets all the modules.
var plugins = require('./modules/plugins.js');
var users = require('./modules/users.js');
var mail = require('./modules/email.js');
console.log('EXTERNAL MODULES: OK'.green);
mongo.connect("mongodb://127.0.0.1/freecoders", function(err, db){
    console.log('DATABASE: OK'.green);
    plugins.getplugins(db);
    if(err) throw err;
    var codedb = db.collection('freecoders');
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
//View engine
app.set('view engine', 'ejs');
console.log('VIEWENGINE: OK'.green);
//Specify folder we want to use
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
console.log('STATICPAGE: OK'.green);
//Body parser middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
console.log('BODYPARSER: OK'.green);
//Express session middleware.
app.use(cookieParser());
app.use(session({
    secret: 'cloud' //This is the secret for the session. Change later...
}));
console.log('SESSIONSSECRET: OK'.green);

//Handle a get request.
app.get('/', function(req, res){
    //Renders the login page.
    console.log('Someone connected.'.green);
    res.render('index', {
        title: 'FreeCoders', //Passing the title and the current user's id.
        user: req.session.userName,
        email: undefined
    });
});
app.get('/privacy', function(req, res){
    res.render('privacy', {
        user: req.session.userName
    });
});
app.get('/users', function(req, res){

    //Calls a function from another script with the input of the current db connections
    users.getusers(db);
    function check(){ //Function just so we know that the right things are displayed on the website
        if(users.result != undefined){
            var allusers = users.result;
            delete allusers.password;
            res.render('users', {
                user: req.session.userName,
                allusers: allusers
            });
        }
    }
            //Waits for a response.

    setTimeout(check, 100); 

});
//If a request to the login page.
app.get('/login', function(req, res){
    res.render('login', {
        title: 'FreeCoders',
        success: true
    });
});
app.get('/addplugin', function(req, res){
    res.render('addplugin', {
        user: req.session.userName
    });
});
app.get('/profile:name', function(req, res) {
    var profilename = req.params.name;
    users.getprofile(db, profilename);
        function check() {
            if (users.profileres != undefined){
                var recievedProfile = users.profileres;
                delete recievedProfile.password;
                res.render('profile', {
                    user: req.session.userName,
                    profile: recievedProfile
                });
            }
        }
    setTimeout(check, 100); 
});
app.get('/joined:email', function(req, res){
    var target = req.params.email;
    var user = req.session.userName;
    var email = req.session.email;
    var subject = 'Someone wants to join your project.';
    var text = 'Hello, This is an automated email sent by our bot on FreeCoders. We just wanted to tell you that someone with the user name of: ' + user + ' wants to join your project. If you are intersted please email his adress: ' + email + '. (We recommend checking his profile first.)';
    mail.sendreq(target, subject, text);
    res.render('index', {
        user: req.session.userName,
        email: target,
    });
});
app.get('/plugininfo:id', function(req, res) {
    var pluginid = req.params.id;
    plugins.getpluginid(db, pluginid);
        function check() {
            if(plugins.getpluginidres != undefined){
                var recievedPlugin = plugins.getpluginidres;
                res.render('plugininfo', {
                    user: req.session.userName,
                    recievedPlugins: recievedPlugin
                });
            }
        }
    setTimeout(check, 100);
});
//If we get an request for the plugins page.
app.get('/plugins', function(req, res){
    //Get the plugins from the other module's result. (Get it again)
    plugins.getplugins(db);
    //Creates variable for receivePlugins
    var receivePlugins = plugins.result; 
    
    //console.log(receivePlugins);
    res.render('plugins', {
        user: req.session.userName,
        plugins: receivePlugins
    });
    
});
app.get('/pluginjava', function(req, res){
    var languageinfo = 'Java';
    console.log('Someone wanted to filter: ' + languageinfo);
    plugins.getlanguage(db, languageinfo);
    function check(){
        if(plugins.langresult[0].language == languageinfo){
            var receivePlugins = plugins.langresult;
        //    console.log(receivePlugins);
            res.render('pluginjava', {
                user: req.session.userName,
                plugins: receivePlugins
            });
            languageinfo = '';
        }
    }
    //Waits for a response.
    setTimeout(check, 200);

});
app.get('/pluginjavascript', function(req, res){
            var languageinfo = 'Javascript';
            console.log('Someone wanted to filter: ' + languageinfo); //Logs that someone filters the language.
            plugins.getlanguage(db, languageinfo);
            function check(){ //Function for checking the content in the database
                if(plugins.langresult[0].language == languageinfo) { //If we get a result that has some kind of index.
                        var receivePlugins = plugins.langresult; //Sets up variable for the recieved plugins gotten from the database.
                        res.render('pluginjavascript', {
                            user: req.session.userName,
                            plugins: receivePlugins
                        });
                        languageinfo = '';
                }
            }
            //Waits for a response.

    setTimeout(check, 200);

});
app.get('/pluginscsharp', function(req, res){
    var languageinfo = 'C#';
    console.log('Someone wanted to filter: ' + languageinfo);
    plugins.getlanguage(db, languageinfo);
            function check(){
                if(plugins.langresult[0].language == languageinfo) {
                        var receivePlugins = plugins.langresult;
                    //    console.log(receivePlugins);
                        res.render('pluginscsharp', {
                            user: req.session.userName,
                            plugins: receivePlugins
                        });
                        languageinfo = '';
                }
            }
    setTimeout(check, 200);

});
app.get('/index', function(req, res){
    res.render('index', {
        user: req.session.userName,
        email: undefined
    });
});
app.get('/myprofile', function(req, res) {
    res.render('myprofile', {
        user: req.session.userName
    });
});

//Catch Submition
app.post('/users/add', function(req, res){

    //Converts all the recieved information into string and better variables.
    var newUser = req.body.signupusr;
    var newEmail = req.body.signupemail;
    var newPwd = req.body.signuppwd;
    var newLanguage = req.body.language;
    var newDeveloper = req.body.developer;
    var newDesc = req.body.desc;
    //Hashing the password and place it into the database.
    var hash = bcrypt.hashSync(newPwd, salt);
    newPwd = hash;
    //Checks if the fields are empty or not.
    if(newUser != "" && newEmail != "" && newPwd != ""){

        //Inserts it into the correct database.
    codedb.insert({user: newUser, email: newEmail, password: newPwd, language: newLanguage, developer: newDeveloper, description: newDesc});
    console.log('A user signed up with the username '.green + newUser.yellow + ' with the email '.green + newEmail.yellow);
    req.session.userName = newUser;
    req.session.email = newEmail;
    res.redirect('/');
    console.log('Hashed the password: '.green + newPwd.yellow);
    } else {
        console.log('Someone tried to signup with an empty field!'.red); //Logs that someone tried to signup with an empty field.
    }
    
});
//If we get a post request that we want to login. 
//The code gets a bit more complicated from now on...
app.post('/users/login', function(req, res){
    
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
                    console.log('Someone successfully logged into the website. The username is: '.green + usr.yellow);
                    //Sets up a new sessions & variables
                    users.getemail(db, usr);
                    //Get email of user:
                    function check(){
                        if(users.emailres != undefined){
                            var recievedEmail = users.emailres;
                            user_id = usr;
                            req.session.email = recievedEmail;
                            req.session.userName = user_id;
                            res.redirect('/');
                        }
                    }
            setTimeout(check, 100);

                } else {
                    //OOPS, wrong password :///
                    console.log(usr.yellow + ' tried to login with the wrong password.'.red);
                    res.redirect('/login?password=false');
                }
             });
             
        } else {
            console.log('Somone tried to login with a false username.'.red);
            res.redirect('/login?username=false');
        }
    });

});
app.post('/plugins/register', function(req, res){
    console.log('Someone tried to add a new plugin...');
    //Get all the information from the client's request.
    var addtitle = req.body.title;
    var addapp = req.body.app;
    var adddescription = req.body.description;
    var addlanguage = req.body.language;
    var adduser = req.session.userName;
    var addemail = req.session.email;
    //Adds the plugin to the database
    plugins.addplugin(db, addtitle, addapp, adddescription, addlanguage, adduser, addemail);
    plugins.getplugins(db);
    res.redirect('/plugins');
});
//Listen for incooming connections on the port (3000)
app.listen(port, function(){
console.log('SERVER: OK'.green)
console.log('Server Running on port 3000'.yellow);
});
});
