var mongodb = require('./db');
var ObjectId = require('mongodb').ObjectID;
var util = require('../util');

function Activity(activity){
  this.title = activity.title;
  this.type = activity.type;
  this.detail = activity.detail;
  this.placard = activity.placard;
  this.publisher = activity.publisher;
  this.time = activity.time;
  this.place = activity.place;
  this.date = activity.date;
  this.hot = activity.hot;
  this.comment = activity.comment;
}

module.exports = Activity;

Activity.prototype.save = function(callback){
  var activity = {
    title: this.title,
    type: this.type,
    detail: this.detail,
    placard: this.placard,
    publisher: this.publisher,
    time: this.time,
    place: this.place,
    date: this.date,
    hot: this.hot,
    comment: this.comment
  };
  
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('activity',function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.insert(activity,{
          safe:true
        },function(err,user){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null,activity[0]);
        });
      });
    });
  });
};

Activity.update = function(id, activity,callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('activity',function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.update({"_id": new ObjectId(id) },activity,function(err){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null);
        });
      });
    });
  });
};

Activity.addComment = function(id, comment, callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('activity',function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.update({"_id": new ObjectId(id) },{"$push":{"comment":comment}},function(err){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null);
        });
      });
    });
  });
};

Activity.delete = function(id,callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('activity',function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.remove({"_id": new ObjectId(id) },function(err){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null);
        });
      });
    });
  });
};

Activity.getTen = function(page,type,date,callback) {
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('activity', function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        if(type == "all"){
          if(date == "all"){
            collection.count(function(err,total){
              collection.find().sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else if(date == "today"){
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth()+1;
            var day = today.getDate();
            var start = Date.parse("'"+year+"/"+month+"/"+day+"'");
            var end = start + 24*60*60*1000;
            collection.count({"date": {"$gte": new Date(start),"$lt": new Date(end)}},function(err,total){
              collection.find({"date": {"$gte": new Date(start),"$lt": new Date(end)}}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else if(date == "tomorrow"){
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth()+1;
            var day = today.getDate();
            var start = Date.parse("'"+year+"/"+month+"/"+day+"'") + 24*60*60*1000;
            var end = start + 24*60*60*1000;
            collection.count({"date": {"$gte": new Date(start),"$lt": new Date(end)}},function(err,total){
              collection.find({"date": {"$gte": new Date(start),"$lt": new Date(end)}}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else if(date =="underway"){
            var now = new Date();
            var start = Date.parse(now);
            collection.count({"date": {"$gte": new Date(start)}},function(err,total){
              collection.find({"date": {"$gte": new Date(start)}}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else if(date == "done"){
            var now = new Date();
            var end = Date.parse(now);
            collection.count({"date": {"$lt": new Date(end)}},function(err,total){
              collection.find({"date": {"$lt": new Date(end)}}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else{
            mongodb.close();
            callback(1);
          }
        }else{
          if(date == "all"){
            collection.count({"type": type},function(err,total){
              collection.find({"type": type}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else if(date == "today"){
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth()+1;
            var day = today.getDate();
            var start = Date.parse("'"+year+"/"+month+"/"+day+"'");
            var end = start + 24*60*60*1000;
            collection.count({"type": type, "date": {"$gte": new Date(start),"$lt": new Date(end)}},function(err,total){
              collection.find({"type": type, "date": {"$gte": new Date(start),"$lt": new Date(end)}}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else if(date == "tomorrow"){
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth()+1;
            var day = today.getDate();
            var start = Date.parse("'"+year+"/"+month+"/"+day+"'") + 24*60*60*1000;
            var end = start + 24*60*60*1000;
            collection.count({"type": type, "date": {"$gte": new Date(start),"$lt": new Date(end)}},function(err,total){
              collection.find({"type": type, "date": {"$gte": new Date(start),"$lt": new Date(end)}}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else if(date =="underway"){
            var now = new Date();
            var start = Date.parse(now);
            collection.count({"type": type, "date": {"$gte": new Date(start)}},function(err,total){
              collection.find({"type": type, "date": {"$gte": new Date(start)}}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else if(date == "done"){
            var now = new Date();
            var end = Date.parse(now);
            collection.count({"type": type, "date": {"$lt": new Date(end)}},function(err,total){
              collection.find({"type": type, "date": {"$lt": new Date(end)}}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
                mongodb.close();
                if(err){
                  return callback(err);
                }
                callback(null,activitys,total);
              });
            });
          }else{
            mongodb.close();
            callback(1);
          }

        }
      });
    });
  });
};

Activity.get = function(id, callback) {
  try{
    new ObjectId(id);
  }
  catch(err){
    return callback(err);
  }
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('activity', function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.findOne({"_id": new ObjectId(id) }, function(err,activity){
          mongodb.close();
          //console.log(activity);
          if(err){
            return callback(err);
          }
          callback(null,activity);
        });
      });
    });
  });
};

Activity.addHot = function(id, callback) {
  try{
    new ObjectId(id);
  }
  catch(err){
    return callback(err);
  }
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('activity', function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        collection.update({"_id": new ObjectId(id) } , {"$inc": {"hot": 1}}, function(err){
          mongodb.close();
          if(err){
            return callback(err);
          }
          callback(null);
        });
      });
    });
  });
};

Activity.getSearchTen = function(page,search,callback) {
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    util.authenticateAndGo(db, function() {
      db.collection('activity', function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        var re = new RegExp(search,"i");
        //console.log(re);
        collection.count({"title": re},function(err,total){
          collection.find({"title": re}).sort({time:-1}).skip((page-1)*10).limit(10).toArray(function(err,activitys){
            mongodb.close();
            if(err){
              return callback(err);
            }
            console.log(total);
            callback(null,activitys,total);
          });
        });
      });
    });
  });
};