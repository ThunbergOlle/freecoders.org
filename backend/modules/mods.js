//Gets mongodb package because we are going to communicate with it.
const mongo = require('mongodb').MongoClient;

//Exports this function.
module.exports.getmods = function getmods(db){
    //Checks the collection "plugins"
    var modsDB = db.collection('mods');
    //Gets all the plugins information to an array.
    var allmods = modsDB.find({}).toArray(function(err, result){
        if(err) throw err;
        //Sets up variable.
        var res = result;
        res.reverse();
        //Export the result that we've gotten from the database.
        module.exports.result = res;
    });
}