var express = require('express');
var router = express.Router();
var sql = require("../dboperations");
var availabeCells = [];
var CBnames = [];
var GIDs = [];
var CIDs = [];

router.get('/inmate', function (req, res, next) {
    sql.getForeignKeys().then(result => {
      availabeCells = result[0];
      GIDs = result[1];
      CBnames = result[2];
      PIDs= result[3];
      res.render('deleteInmate', { title: 'Delete Inmate',pids: PIDs});
    });
});

router.post('/inmate', function (req, res, next) {
    const PID = req.body.pid;
    sql.DeleteInmate(PID,res);
    sql.CellCountCheck();
});


router.get('/guard', function (req, res, next) {
  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    PIDs= result[3];
    res.render('deleteGuard', { title: 'Delete Guard',gids: GIDs});
  });
});

router.post('/guard', function (req, res, next) {
  const GID = req.body.gid;
  sql.DeleteGuard(GID,res);
  sql.UpdateGuardClearance();
  sql.CheckForWarden();
});

router.get('/cellblock', function (req, res, next) {
  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    PIDs= result[3];
    res.render('deleteCellBlock', { title: 'Delete Cell Block',cbnames: CBnames});
  });
});

router.post('/cellblock', function (req, res, next) {
  const CBname = req.body.cbname;
  sql.DeleteCellBlock(CBname,res);
});

router.get('/cell', function (req, res, next) {
  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    PIDs= result[3];
    CIDs= result[4];
    res.render('deleteCell', { title: 'Delete Cell',cids: CIDs});
  });
});

router.post('/cell', function (req, res, next) {
  const CID = req.body.cid;
  sql.DeleteCell(CID,res);
  sql.CellCountCheck();
});

router.get('/shift', function (req, res, next) {
  var Days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var Time_s = ['Day','Night'];
  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    PIDs= result[3];
    res.render('deleteShift', { title: 'Delete Shift',days: Days,time_s: Time_s, gids: GIDs,cbnames: CBnames});
  });
});

router.post('/shift', function (req, res, next) {
  const Day = req.body.day;
  const Time_ = req.body.time_;
  const GID = req.body.gid;
  const CBname = req.body.cbname;
  sql.DeleteShift(Day,Time_,GID,CBname,res);
});

module.exports = router;