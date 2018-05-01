const mongo = require('mongodb').MongoClient;

//Makes a module to export that's getting the users from the database.
module.exports.getusers = function getusers(db){
    var usersDB = db.collection('freecoders');

    var allusers = usersDB.find({}).toArray(function(err, result){
        var res = result;
        //console.log(res);
        module.exports.result = res;
    });
}