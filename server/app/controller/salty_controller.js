var SaltyMcSalterson = require('../model/salty_model');

exports.getAllSaltyPlayers = function(req, res) {
    SaltyMcSalterson.getAllSaltyPlayers(function(err, saltyPlayers) {
        if (err)
            res.send(err);
        res.send(saltyPlayers);
    });
};



exports.addSalt = function(req, res) {
    var new_salt = new SaltyMcSalterson({salty_player: req.params.salty_player, salt_granules: req.params.salt_granules, reporter: req.params.reporter});
    if(!new_salt || !new_salt){
        res.status(400).send({ error:true, message: 'Please provide player name' });
    }
    else{
        SaltyMcSalterson.addSalt(new_salt, function(err, saltyPlayers) {
            if (err)
                res.send(err);
            res.json(saltyPlayers);
        });
    }
};

exports.addAllSalt = function(req, res) {
    var new_salt = new SaltyMcSalterson({salt_granules: req.params.salt_granules});
    SaltyMcSalterson.allAddSalt(new_salt, function(err, saltyPlayers) {
        if (err)
            res.send(err);
        res.json(saltyPlayers);
    });
};

exports.getSaltByName = function(req, res) {
    SaltyMcSalterson.getSaltByName(req.params.salty_player, function(err, saltyPlayer) {
        if (err)
            res.send(err);
        res.json(saltyPlayer);
    });
};

/* functions below this are unused as of 01/14/19 */
exports.updateRageQuitterById = function(req, res) {
    RageQuitter.updateCounterById(req.params.rageQuitterId, function(err, rageQuitter) {
        if (err)
            res.send(err);
        res.json(rageQuitter);
    });
};


exports.deleteRageQuitter = function(req, res) {
    RageQuitter.remove( req.params.rageQuitterId, function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Rager has been successfully deleted' });
    });
};