var express = require('express');
var router = express.Router();
var sql = require("../dboperations");

router.get('/0', function (req, res, next) {
      res.render('queries0',{title:'Query 0'});
});

router.post('/0', function (req, res, next) {
  const sentence = req.body.sentence;
  res.redirect('/queries/0/result?sentence='+sentence);
});

router.get('/0/result', function (req, res, next) {
var sentence = req.query.sentence;
sql.Query0(sentence,res).then(result => {
  res.render('queries0result',{ title: 'Query 0 Result' , inmates: result});
  });
});

router.get('/1', function (req, res, next) {
    
  const clearances = ["0","1","2","3","4"];
    
        res.render('queries1',{title:'Query 1',clearances:clearances});
});

router.post('/1', function (req, res, next) {
  const clearance = req.body.clearance;
  res.redirect('/queries/1/result?clearance='+clearance);
});

router.get('/1/result', function (req, res, next) {
var clearance = req.query.clearance;
sql.Query1(clearance,res).then(result => {
  res.render('queries1result',{ title: 'Query 1 Result' , guards: result});
  });
});

router.get('/2', function (req, res, next) {
  const CBTypes = ["Normal_M","Normal_F","Solitary_M","Solitary_F"];
  res.render('queries2',{title:'Query 2',cbtypes:CBTypes});
});

  router.post('/2', function (req, res, next) {
    const CBType = req.body.CBType;
    res.redirect('/queries/2/result?CBType='+CBType);
});

router.get('/2/result', function (req, res, next) {
  var CBType = req.query.CBType;
  sql.Query2(CBType,res).then(result => {
    res.render('queries2result',{ title: 'Query 2 Result' , inmates: result});
    });
  });
  

  router.get('/3', function (req, res, next) {
    
    sql.getForeignKeys().then(result => {
        availabeCells = result[0];
        GIDs = result[1];
        CBnames = result[2];
        // console.log(availabeCells);
        // console.log(GIDs);
        console.log(CBnames);
    
        res.render('queries3',{title:'Query 3',gids:GIDs});
      });
  });

  router.post('/3', function (req, res, next) {
    const GID = req.body.GID;
    res.redirect('/queries/3/result?GID='+GID);
});

router.get('/3/result', function (req, res, next) {
  var GID = req.query.GID;
  sql.Query3(GID,res).then(result => {
    res.render('queries3result',{ title: 'Query 3 Result' , cbtypes: result});
    });
  });

  router.get('/4', function (req, res, next) {
    sql.Query4().then(result => {
        res.render('queries4',{title:'Query 4',results:result});
      });
  });

  router.get('/5', function (req, res, next) {
    
    sql.getForeignKeys().then(result => {
        availabeCells = result[0];
        GIDs = result[1];
        CBnames = result[2];
        // console.log(availabeCells);
        // console.log(GIDs);
        console.log(CBnames);
    
        res.render('queries5',{title:'Query 5',cbnames:CBnames});
      });
  });

  router.post('/5', function (req, res, next) {
    const CBname = req.body.CBname;
    res.redirect('/queries/5/result?CBname='+CBname);
});

router.get('/5/result', function (req, res, next) {
  var CBname = req.query.CBname;
  sql.Query5(CBname,res).then(result => {
    res.render('queries5result',{ title: 'Query 5 Result' , results: result});
    });
  });

  router.get('/6', function (req, res, next) {
        res.render('queries6',{title:'Query 6'});
  });

  router.post('/6', function (req, res, next) {
    const CBType = req.body.cbtype;
    res.redirect('/queries/6/result?CBType='+CBType);
});

router.get('/6/result', function (req, res, next) {
  var CBType = req.query.CBType;
  sql.Query6(CBType,res).then(result => {
    res.render('queries6result',{ title: 'Query 6 Result' , results: result});
    });
  });

  router.get('/7', function (req, res, next) {
    
    sql.Query7().then(result => {
        res.render('queries7',{title:'Query 7',results:result});
      });
  });

  router.get('/8', function (req, res, next) {
    sql.Query8().then(result => {
        res.render('queries8',{title:'Query 8',results:result});
      });
  });

  router.get('/9', function (req, res, next) {
    
    sql.getForeignKeys().then(result => {
        availabeCells = result[0];
        GIDs = result[1];
        CBnames = result[2];
        // console.log(availabeCells);
        // console.log(GIDs);
        console.log(CBnames);
    
        res.render('queries9',{title:'Query 9',cbnames:CBnames});
      });
  });

  router.post('/9', function (req, res, next) {
    const cbname = req.body.cbname;
    const MaxCap = req.body.MaxCap;
    res.redirect('/queries/9/result?cbname='+ cbname +'&MaxCap='+MaxCap);
});

router.get('/9/result', function (req, res, next) {
  var cbname = req.query.cbname;
  var MaxCap = req.query.MaxCap;
  sql.Query9(cbname,MaxCap,res).then(result => {
    res.render('queries9result',{ title: 'Query 9 Result' , results: result});
    });
  });

  router.get('/10', function (req, res, next) {
    sql.Query10().then(result => {
        res.render('queries10',{ title: 'Query 10' , cells: result});
      });
  });


module.exports = router;