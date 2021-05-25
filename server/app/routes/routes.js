'use strict';
module.exports = function(app) {
  var rageQuit = require('../controller/controller');
  var saltBot = require('../controller/salty_controller');

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  /* rage quit bot */
  app.route('/rager/:player')
    .post(rageQuit.getRageQuitterByName);

  app.route('/rager/new/:player&:reporter')
    .post(rageQuit.createRageQuitter);

  app.route('/rager/list')
    .get(rageQuit.get_all_rage_quitters);

  /* salt bot */
  app.route('/salt/:salty_player')
      .post(saltBot.getSaltByName);

  app.route('/salt/new/:salty_player&:salt_granules&:reporter')
      .post(saltBot.addSalt);

  app.route('/salt/new/:salt_granules')
      .post(saltBot.addAllSalt);

  app.route('/salt/list')
      .get(saltBot.getAllSaltyPlayers);

  /* Routes not used
  app.route('/rager/update/:rageQuitterId')
    .post(rageQuit.updateRageQuitterById);

  app.route('/rager/delete/:rageQuitterId')
    .post(rageQuit.deleteRageQuitter);
   */
};