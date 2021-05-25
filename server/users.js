router.get('/', function(req, res, next) {
  res.locals.connection.query('SELECT * from ragequit', function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});