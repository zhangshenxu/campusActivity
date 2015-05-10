var settings = require('./settings');

exports.authenticateAndGo = function authenticateAndGo(db, callback) {
  db.authenticate(settings.username, settings.password, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Database user authenticated');

    callback();
  });
};