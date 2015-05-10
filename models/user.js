var mongodb = require('./db');
var ObjectId = require('mongodb').ObjectID;
var util = require('../util');
var https = require('https');

function User(user){
  this.username = user.username;
  this.password = user.password;
  //this.email = user.email;
}

module.exports = User;

//存储用户信息
User.prototype.save = function(callback){
  var user = {
    username: this.username,
    password: this.password,
    //email: this.email
  };
  mongodb.open(function(err, db){
    util.authenticateAndGo(db, function() {
      if(err){
        mongodb.close();
        return callback(err);
      }
      db.collection('users',function(err, collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.insert(user,{
          safe:true
        },function(err, user){
          mongodb.close();
          if (err){
            return callback(err);
          }
          callback(null,user[0]);
        });
      });
    });
  });
};

//读取用户信息
User.get = function(username, callback){
  mongodb.open(function(err, db){
    if (err) {
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('users', function(err, collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.findOne({
          username: username
        },function(err, user){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null, user);
        });
      });
    });
  });
};

User.getById = function(id, callback) {
  try{
    new ObjectId(id);
  }
  catch(err){
    return callback(err);
  }
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('users', function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.findOne({"_id": new ObjectId(id) }, function(err,user){
          mongodb.close();
          //console.log(activity);
          if(err){
            return callback(err);
          }
          callback(null,user);
        });
      });
    });
  });
};



User.jhLogin = function(username,password,callback){
  https.get("https://user.zjut.com/api.php?app=member&action=login&username="+username+"&password="+password, function(res){
    var data ='';
    res.on('data',function(chunk){
      data += chunk;
    });
    res.on('end',function(){
      var aa = JSON.parse(data);
      //console.log(aa);
      callback(aa.state);
    });
  });
};
