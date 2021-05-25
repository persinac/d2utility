var RageQuitter = require('../model/model.js');

exports.get_all_rage_quitters = function(req, res) {
  RageQuitter.getAllRageQuitters(function(err, rageQuitter) {
    if (err)
      res.send(err);
    res.send(rageQuitter);
  });
};



exports.createRageQuitter = function(req, res) {
  var new_rage_quitter = new RageQuitter({player: req.params.player, reporter: req.params.reporter});
  if(!new_rage_quitter || !new_rage_quitter){
    res.status(400).send({ error:true, message: 'Please provide player name' });
  }
  else{
    RageQuitter.createRageQuitter(new_rage_quitter, function(err, rageQuitter) {
      if (err)
        res.send(err);
      res.json(rageQuitter);
    });
  }
};

exports.getRageQuitterByName = function(req, res) {
  RageQuitter.getRageQuitterByName(req.params.player, function(err, rageQuitter) {
    if (err)
      res.send(err);
    res.json(rageQuitter);
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