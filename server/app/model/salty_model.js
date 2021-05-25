var sql = require('./db.js');

//Salty object constructor
var SaltyMcSalterson = function(salt) {
    console.log(salt);
    this.salty_player = salt.salty_player;
    this.salt_granules = salt.salt_granules;
    this.reporter = salt.reporter;
    this.salt_added_on = new Date();
};
SaltyMcSalterson.addSalt = function addSalt(newSalt, result) {
    sql.query("INSERT INTO saltyness set ?", newSalt, function (err, res) {

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
SaltyMcSalterson.getSaltByName = function getSaltByName(name, result) {
    sql.query("Select * from overall_salt_level where salty_player = ?", [name], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);

        }
    });
};
SaltyMcSalterson.getAllSaltyPlayers = function getAllSaltyPlayers(result) {
    sql.query("Select * from overall_salt_level", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            console.log('salty surprise : ', res);
            result(null, res);
        }
    });
};

SaltyMcSalterson.allAddSalt = function allAddSalt(newSalt, result) {
    sql.query("CALL SB_ALL_ADD_SALT(?)", newSalt.salt_granules, function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res);
            result(null, res);
        }
    });
};

/* Not used */
SaltyMcSalterson.updateCounterById = function(id, result){
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
SaltyMcSalterson.remove = function(id, result){
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

module.exports= SaltyMcSalterson;