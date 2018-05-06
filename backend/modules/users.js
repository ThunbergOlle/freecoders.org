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

module.exports.getprofile = function profile(db, name){
    //SETS COLLECTION
    var usersDB = db.collection('freecoders');

    var target = name.replace(/\s+/g, ''); //MODIFY the string.
    usersDB.findOne({user: target}, function(err, result){ //Find in database will a callback of err, & the result
        if(err) throw err;
        var res = result;
        module.exports.profileres = res; //reponse that the server will recieve.
    });
}