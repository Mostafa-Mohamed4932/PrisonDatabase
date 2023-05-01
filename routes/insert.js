var express = require('express');
var router = express.Router();
var sql = require("../dboperations");
var availabeCells = [];
var CBnames = [];
var GIDs = [];

router.get('/', function (req, res, next) {
  //nothing
});

router.get('/inmate', function (req, res, next) {
  sql.getdata();

  const genders = ['M','F'];
  const pconduct = ["Good","Bad"];

  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('insertInmate', { title: 'Insert Inmate',cids: availabeCells ,genders: genders,pconducts: pconduct});
  });
});


router.post('/inmate', function (req, res, next) { 
  var InmateInfo ={
    PFirst: req.body.pfirst,
    PLast: req.body.plast,
    CID: req.body.cid,
    Gender: req.body.gender,
    PSentence: req.body.psentence,
    PGang: req.body.pgang,
    PConduct: req.body.pconduct,
  };

  sql.InsertInmate(InmateInfo,res);
  sql.ParoleCheck();
  sql.CellCountCheck();
});


router.get('/guard', function (req, res, next) {
  sql.getdata();

  const type = ["Riot Unit","K-9 Unit","Watch Tower","CCTV Operator","Security Officer"];

  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('insertGuard', { title: 'Insert Guard',types: type});
  });
});

router.post('/guard', function (req, res, next) { 
  var GuardInfo ={
    GFirst: req.body.guardFirstName,
    GLast: req.body.guardLastName,
    GType: req.body.type,
  };

  sql.InsertGuard(GuardInfo,res);
  sql.CheckForWarden();
  sql.UpdateGuardClearance();
});

router.get('/shift', function (req, res, next) {
  sql.getdata();

  const days = ["Saturday","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const time_s = ["Day","Night"];

  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('insertShift', { title: 'Insert Shift',cbnames: CBnames ,gids: GIDs,days: days,time_s: time_s});
  });
});

router.post('/shift', function (req, res, next) { 
  var ShiftInfo ={
    Day: req.body.day,
    Time_: req.body.time_,
    GID: req.body.gid,
    CBname: req.body.cbname,
  };
  //console.log(ShiftInfo)
  sql.InsertShift(ShiftInfo,res);
});

router.get('/cellblock', function (req, res, next) {
  sql.getdata();

  const CBtypes = ["Normal","Solitary"];

  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('insertCellBlock', { title: 'Insert Cell Block',cbtypes: CBtypes});
  });
});

router.post('/cellblock', function (req, res, next) {
  tempName = "CB_" + req.body.cbname
  var CellBlockInfo ={
    CBname: tempName.toUpperCase(),
    NoCams: req.body.nocams,
    CBType: req.body.cbtype,
  };
  //console.log(ShiftInfo)
  sql.InsertCellBlock(CellBlockInfo,res);
  sql.SolitaryCheck();
});

router.get('/cell', function (req, res, next) {
  sql.getdata();

  const maxcap = [1,2,3,4];
  sql.getForeignKeys().then(result => {
    availabeCells = result[0];
    GIDs = result[1];
    CBnames = result[2];
    // console.log(availabeCells);
    // console.log(GIDs);
    // console.log(CBnames);

    res.render('insertCell', { title: 'Insert Cell Block',maxcaps: maxcap ,cbnames: CBnames});
  });
});
router.post('/cell', function (req, res, next) {
  var CellStat = "Empty";
  var CellInfo ={
    CellStatus: CellStat,
    MaxCap: req.body.maxcap,
    CBname: req.body.cbname,
  };
  console.log(CellInfo);
  sql.InsertCell(CellInfo,res);
  sql.SolitaryCheck();
  sql.CellCountCheck();
});

router.get('/testconnect', function (req, res, next) {
    sql.getdata();
    res.render('index', { title: 'Express' });
});

router.get('/getdata_withQuery', function (req, res, next) {
  cmd = "SELECT * FROM cells";
  sql.getdata_withQuery(cmd).then(result => {
    res.json(result[0]);
  })
});

module.exports = router;