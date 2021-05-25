var sql = require('./db.js');

//Rage Quitter object constructor
var RageQuitter = function(rageQuitter){
  console.log(rageQuitter);
  this.player = rageQuitter.player;
  this.reporter = rageQuitter.reporter;
  this.reported_on = new Date();
};
RageQuitter.createRageQuitter = function createRageQuitter(newRageQuitter, result) {
  sql.query("INSERT INTO ragequit set ?", newRageQuitter, function (err, res) {

    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};
RageQuitter.getRageQuitterByName = function getByName(name, result) {
  sql.query("Select * from aggregated_ragequit where player = ?", [name], function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);

    }
  });
};
RageQuitter.getAllRageQuitters = function getAllTask(result) {
  sql.query("Select * from aggregated_ragequit", function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      console.log('rage quitters : ', res);
      result(null, res);
    }
  });
};
RageQuitter.updateCounterById = function(id, result){
  sql.query("UPDATE ragequit SET counter = counter + 1, last_rage_quit = now() WHERE id = ?", id, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      result(null, res);
    }
  });
};
RageQuitter.remove = function(id, result){
  sql.query("DELETE FROM ragequit WHERE id = ?", [id], function (err, res) {

    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{

      result(null, res);
    }
  });
};

module.exports= RageQuitter;