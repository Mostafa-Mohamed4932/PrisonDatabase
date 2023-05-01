var express = require('express');
var router = express.Router();
var sql = require("../dboperations");

router.get('/cellcount', function (req, res, next) {
    sql.CountInmate().then(result => {
        res.render('operationcellcount',{title:'Cell Count',results:result});
      });
  });

router.get('/moveinmate', function (req, res, next) {
    sql.getForeignKeys().then(result => {
      availabeCells = result[0];
      PIDs = result[3];
        res.render('operationmoveinmate',{title:'Move Inmate',pids:PIDs,cids:availabeCells});
      });
  });

  router.post('/moveinmate', function (req, res, next) {
    const PID = req.body.PID;
    const CID = req.body.CID;
    sql.MoveInmate(PID,CID,res).then(result => {
      sql.CellCountCheck();
    });
    res.redirect('/inmates');
});

module.exports = router; 