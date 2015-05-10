var mongodb = require('./db');
var util = require('../util');

function Suggestion(suggestion){
  this.name = suggestion.name;
  this.suggest = suggestion.suggest;
}

module.exports = Suggestion;


Suggestion.prototype.save = function(callback){
  var suggestion = {
    name: this.name,
    suggest: this.suggest
  };
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('suggestion',function(err, collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.insert(suggestion,{
          safe:true
        },function(err){
          mongodb.close();
          if (err){
            return callback(err);
          }
          callback(null);
        });
      });
    });
  });
};

Suggestion.get = function(callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('suggestion',function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.find().toArray(function(err,suggestions){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null,suggestions);
        });
      });
    });
  });
};