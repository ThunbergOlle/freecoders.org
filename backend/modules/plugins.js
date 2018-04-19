//Gets mongodb package because we are going to communicate with it.
const mongo = require('mongodb').MongoClient;

//Exports this function.
module.exports.getplugins = function getplugins(db){
    //Checks the collection "plugins"
    var pluginsDB = db.collection('plugins');


    //Gets all the plugins information to an array.
    var allplugins = pluginsDB.find({}).toArray(function(err, result){
        if(err) throw err;
        //Sets up variable.
        var res = result;
        //Export the result that we've gotten from the database.
        module.exports.result = res;
    });
}

module.exports.addplugin = function addplugin(db, addtitle, addapp, adddescription, addlanguage, adduser){
    var pluginsDB = db.collection('plugins');
    //Insert into database.
    pluginsDB.insert({userName: adduser, game: addapp, title: addtitle, description: adddescription, language: addlanguage});
    module.exports.pluginres = 'Success';
}

//Module that gets information and reads from database.
module.exports.getlanguage = function getlanguage(db, languageinfo){
    var pluginsDB = db.collection('plugins');

    pluginsDB.find({ "language": languageinfo}).toArray(function(err, result){
        if(err) throw err;
        
        var res = result;
        
        module.exports.langresult = res;
    });
}