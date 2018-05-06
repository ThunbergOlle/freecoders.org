//Gets mongodb package because we are going to communicate with it.
const mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
//Exports this function.
module.exports.getplugins = function getplugins(db){
    //Checks the collection "plugins"
    var pluginsDB = db.collection('plugins');
    //Gets all the plugins information to an array.
    var allplugins = pluginsDB.find({}).toArray(function(err, result){
        if(err) throw err;
        //Sets up variable.
        var res = result;
        res.reverse();
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

//Gets a special plugin from the database with the passed in ID.
module.exports.getpluginid = function getpluginid(db, id){
    var pluginsDB = db.collection('plugins'); //Declares collection
    var reciever = id; 
    var newID = reciever.replace(/\s+/g, ''); //Removes the space in the beginning
    pluginsDB.findOne({"_id": new ObjectId(newID)},function(err, result){ //Crates a new object id and finds it in the database.
        if(err) throw err; //Logs errors
        var res = result;
        console.log('Someone viewed the plugin page with the id: ' + res._id);
        module.exports.getpluginidres = res; //Exports module.
    });
}
//Module that gets information and reads from database.
module.exports.getlanguage = function getlanguage(db, languageinfo){
    var pluginsDB = db.collection('plugins');

    pluginsDB.find({ "language": languageinfo}).toArray(function(err, result){
        if(err) throw err;
        var res = result;
        res.reverse();
        module.exports.langresult = res;
        //FULLY WORKING MODULE. NO BUGGS OR ANYTHING TESTED BY OLLE.        
    });
}