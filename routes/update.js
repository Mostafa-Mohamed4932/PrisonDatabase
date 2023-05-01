var express = require('express');
var router = express.Router();
var sql = require("../dboperations");
var availabeCells = [];
var CBnames = [];
var GIDs = [];

router.get('/cellblocks', function (req, res, next) {
  sql.getdata();

  const CBtypes = ["Normal","Solitary"];
  
  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    CIDs = result[4];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('updateCellBlocks', { title: 'Update Cell Block',cbnames:CBnames,cbtypes: CBtypes});
  });});

router.post('/cellblocks', function (req, res, next) {
  var CellBlockInfo ={
    selec: req.body.propselect,
    CBname: req.body.cbname,
    NoCams: req.body.nocams,
    CBType: req.body.cbtype,
  };
  sql.UpdateCellBlock(CellBlockInfo,res);
});

router.get('/cells', function (req, res, next) {
  sql.getdata();

  const maxcaps = [1,2,3,4];
  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    CIDs = result[4];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('updateCells', { title: 'Update Cell',cids: CIDs , maxcaps: maxcaps, cbnames: CBnames});
  });
});

router.post('/cells', function (req, res, next) {
    var CellInfo ={
        selec: req.body.propselect,
        MaxCap: req.body.maxcap,
        CBname: req.body.cbname,
        CID: req.body.cid,
    };
    //console.log(CellInfo);
    sql.UpdateCell(CellInfo,res);
    sql.SolitaryCheck();
    sql.CellCountCheck();
});

router.get('/guards', function (req, res, next) {
  sql.getdata();

  const type = ["K-9 Unit","Riot Unit","Watch Tower","CCTV Operator","Security Officer"];

  sql.getForeignKeys().then(result => {
    console.log(result);
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('updateGuards', { title: 'Update Guard',gids:GIDs,gtypes: type});
  });
});

router.post('/guards', function (req, res, next) {
  var GuardInfo ={
    selec: req.body.propselect,
    GID: req.body.gid,
    GFirst: req.body.gfirst,
    GLast: req.body.glast,
    GType: req.body.gtype
  };
  //console.log(GuardInfo);
  sql.UpdateGuard(GuardInfo,res);
  sql.UpdateGuardClearance();
  sql.CheckForWarden();
  
});

router.get('/inmates', function (req, res, next) {
  sql.getdata();

  const genders = ["M","F"];
  const pconducts = ["Good","Bad"];

  sql.getForeignKeys().then(result => {
    console.log(result);
    availabeCells = result[0];
    PIDs = result[3];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('updateInmates', { title: 'Update Inmate',pids:PIDs,cids:availabeCells,genders:genders,pconducts:pconducts});
  });
});

router.post('/inmates', function (req, res, next) {
  var InmateInfo ={
    selec: req.body.propselect,
    PID: req.body.pid,
    PFirst: req.body.pfirst,
    PLast: req.body.plast,
    Gender: req.body.gender,
    PSentence: req.body.psentence,
    PGang: req.body.pgang,
    PConduct: req.body.pconduct,
    CID: req.body.cid
  };
  sql.UpdateInmate(InmateInfo,res);
  sql.CellCountCheck();
});

router.get('/shifts', function (req, res, next) {
  sql.getdata();

  const DAYs = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];
  const TIME_s = ["Day","Night"];

  sql.getForeignKeys().then(result => {
    console.log(result);
    GIDs = result[1];
    CBnames = result[2];

    res.render('updateShifts', { title: 'Update Shift',days:DAYs,time_s:TIME_s,gids:GIDs,cbnames:CBnames,day1s:DAYs,time_1s:TIME_s,gid1s:GIDs,cbname1s:CBnames});
  });
});

router.post('/shifts', function (req, res, next) {
  var ShiftInfo ={
    selec: req.body.propselect,
    Day1: req.body.day1,
    Time_1: req.body.time_1,
    GID1: req.body.gid1,
    CBname1: req.body.cbname1,
    Day: req.body.day,
    Time_: req.body.time_,
    GID: req.body.gid,
    CBname: req.body.cbname,
  };
  sql.UpdateShift(ShiftInfo,res);
});

module.exports = router;