  // connect to your database
var config = require('./dbconfig');
const sql = require('mssql');
const router = require('./routes');

async function getdata() {
    try {
        let pool = await sql.connect(config);
        console.log("Connected!");
    }
    catch (error) {
        console.log(error);
    }
}

async function Query0(PSentence,res){
  try{
  var cmd = "SELECT * FROM Inmates WHERE CAST(PSentence AS INT) > '"+ PSentence +"' AND PSentence != 'Death Sentence';";
  return getdata_withQuery(cmd).then(result => {
    console.log(result);
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query1(Clearance,res){
  try{
  var cmd = "SELECT * FROM Guards WHERE Clearance > '"+ Clearance +"';";
  return getdata_withQuery(cmd).then(result => {
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query2(CBType,res){
  try{
  var cmd = "SELECT Inmates.* FROM Inmates INNER JOIN Cell ON Inmates.CID = Cell.CID INNER JOIN CellBlock ON Cell.CBname = CellBlock.CBname WHERE CellBlock.CBType = '"+ CBType +"';";
  return getdata_withQuery(cmd).then(result => {
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query3(GID,res){
  try{
  var cmd = "SELECT CellBlock.CBType FROM CellBlock INNER JOIN Shifts ON CellBlock.CBname = Shifts.CBname INNER JOIN Guards ON Shifts.GID = Guards.GID WHERE Guards.GID = '"+ GID +"';";
  return getdata_withQuery(cmd).then(result => {
    console.log(result[0]);
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query4(){
  try{
  var cmd = "SELECT CBname, COUNT(*) AS num_shifts FROM Shifts GROUP BY CBname;";
  return getdata_withQuery(cmd).then(result => {
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query5(CBname,res){
  try{
  var cmd = "SELECT COUNT(*) AS NoCells FROM Cell WHERE CBname ='"+ CBname +"';";
  return getdata_withQuery(cmd).then(result => {
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query6(CBType,res){
  try{
  var cmd = "SELECT * FROM CellBlock WHERE CBType LIKE '%"+ CBType +"%';";
  return getdata_withQuery(cmd).then(result => {
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query7(){
  try{
  var cmd = "SELECT Shifts.CBname, Count(*) AS NoGuards From Guards JOIN Shifts ON Guards.GID = Shifts.GID GROUP BY(Shifts.CBname);";
  return getdata_withQuery(cmd).then(result => {
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query8(){
  try{
  var cmd = "SELECT Cell.CBname, Cell.CID, COUNT(*) AS NoInmates FROM Inmates JOIN Cell ON Inmates.CID = Cell.CID GROUP BY Cell.CBname, Cell.CID;";
  return getdata_withQuery(cmd).then(result => {
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query9(cbname,MaxCap,res){
  try{
  var cmd = "SELECT CID FROM Cell WHERE CBname = '"+ cbname +"' OR MaxCap = '"+ MaxCap +"';";
  return getdata_withQuery(cmd).then(result => {
    return result[0];
  });
}catch(error){
  console.log(error);
  }
}

async function Query10(){
  try{
  var EmptyCells = [];
  var cmd = "SELECT * FROM Cell LEFT JOIN Inmates ON Cell.CID = Inmates.CID WHERE Inmates.CID IS NULL;";
  return getdata_withQuery(cmd).then(result => {
    EmptyCells = result[0];
    for(var i = 0; i < EmptyCells.length; i++){
      EmptyCells[i].CID = result[0][i].CID[0];
    }
    return EmptyCells;
  });
}catch(error){
  console.log(error);
  }
}

async function CountInmate(){
  try{
    var cmd = "SELECT Cell.CID, COUNT(*) AS NoInmates FROM Inmates JOIN Cell ON Inmates.CID = Cell.CID GROUP BY Cell.CID;";
    return getdata_withQuery(cmd).then(result => {
      return result[0];
    });
  }catch(error){
    console.log(error);
  }
}

async function SolitaryCheck(){
  try{
    var cmd = "UPDATE Cell SET MaxCap = 1 FROM Cell INNER JOIN CellBlock ON Cell.CBname = CellBlock.CBname WHERE CellBlock.CBType = 'Solitary';";
    return getdata_withQuery(cmd).then(result => {
      console.log("Cells are Solitary");
    });
  }catch(error){
    console.log(error);
  }
}

async function MoveInmate(PID,CID,res){
  try{
  var cmd = "UPDATE Inmates SET CID = '"+ CID +"' WHERE PID = '"+ PID +"';";
  return getdata_withQuery(cmd).then(result => {
  });
  }catch(error){
    console.log(error);
  }
}

async function CellCountCheck(){
  try{
    console.log("Checking Cell Count");
    cmd = "UPDATE Cell SET CellStatus = 'Empty' WHERE CellStatus != 'Maintenance' AND CID NOT IN (SELECT Inmates.CID FROM Inmates JOIN Cell ON Inmates.CID = Cell.CID); UPDATE Cell SET CellStatus = 'Full' WHERE Cell.CID IN (SELECT Inmates.CID FROM Inmates GROUP BY Inmates.CID HAVING COUNT(*) = Cell.MaxCap); UPDATE Cell SET CellStatus = 'Occupied' WHERE Cell.CID IN (SELECT Inmates.CID FROM Inmates GROUP BY Inmates.CID HAVING COUNT(*) < (SELECT MaxCap FROM Cell WHERE Cell.CID = Inmates.CID)) AND EXISTS (SELECT Inmates.CID FROM Inmates WHERE Inmates.CID = Cell.CID GROUP BY Inmates.CID HAVING COUNT(*) > 0);";
    return getdata_withQuery(cmd).then(result => {
      console.log("Cell Count Checked");
      return result[0];
    });
  }catch(error){
  console.log(error);
  }
}

async function ParoleCheck(){
  try{
    console.log("Checking Parole");
    var cmd = "UPDATE Inmates SET Parole = 'Yes' WHERE PGang IS NULL AND PSentence != 'Death Sentence' AND PConduct = 'Good'; UPDATE Inmates SET Parole = 'No' WHERE PGang IS NOT NULL OR PSentence = 'Death Sentence' OR PConduct = 'Bad';"
    return getdata_withQuery(cmd).then(result => {
      console.log("Parole Checked");
    });
  }catch(error){
  console.log(error);
  }
}
    

async function CheckForWarden(){
  try{
    console.log("Checking for warden");
    cmd = "SELECT GID FROM Guards WHERE GType = 'Warden' OR Clearance = 0 OR Warden = 'True';";
    return getdata_withQuery(cmd).then(result => {
      if (result[0].length > 1){
        console.log("More Than One Warden found");
        console.log("Demoting all wardens");
        cmd = "UPDATE Guards SET Clearance = 1, GType = 'Riot Unit', Warden = 0 WHERE GID IN (SELECT GID FROM Guards WHERE GType = 'Warden' OR Clearance = 0 OR Warden = 'True');";
        return getdata_withQuery(cmd).then(result => {
          console.log("Wardens Demoted");
          cmd = "UPDATE guards SET Gtype = 'Warden', Warden = 1, Clearance = 0 WHERE GID = (SELECT TOP 1 GID from guards where Clearance = 1 ) AND (NOT EXISTS (SELECT 1 FROM guards WHERE GType = 'Warden' AND Warden = 1));";
          getdata_withQuery(cmd).then(result => {
            console.log("Warden assigned");   
          });
        });
      }
      else if (result[0].length == 0){
        console.log("No warden found");
        console.log("Selecting first guard with highest clearance"); 
        cmd = "UPDATE guards SET Gtype = 'Warden', Warden = 1, Clearance = 0 WHERE GID = (SELECT TOP 1 GID from guards where Clearance = 1 ) AND (NOT EXISTS (SELECT 1 FROM guards WHERE GType = 'Warden' AND Warden = 1);";
        getdata_withQuery(cmd).then(result => {
          console.log("Warden assigned");   
        });
      }
      else{
        console.log("One Warden found");
      }
    });
  }catch(error){
    console.log(error);
  }
}

function UpdateGuardClearance(){
  cmd = "UPDATE Guards SET Clearance = 1, Warden = 0 WHERE GType = 'Riot Unit' OR GType = 'K-9 Unit'; UPDATE Guards SET Clearance = 2, Warden = 0 WHERE GType = 'Watch Tower'; UPDATE Guards SET Clearance = 3, Warden = 0 WHERE GType = 'CCTV Operator'; UPDATE Guards SET Clearance = 4, Warden = 0 WHERE GType = 'Security Officer';";
  return getdata_withQuery(cmd).then(result => {
    console.log("Guard Clearence Updated");   
  });
}

function getForeignKeys() {
    var AvailCIDs = [];
    var GIDs  = [];
    var AllCIDs  = [];
    var CBnames  = [];
    var PIDs=[];
    cmd = "SELECT CID FROM cell WHERE (CellStatus = 'Empty' OR CellStatus = 'Occupied'); SELECT GID FROM guards; SELECT CBname FROM cellblock; SELECT PID FROM Inmates; SELECT CID FROM cell;";
    
    return getdata_withQuery(cmd).then(result => {
      //console.log(result); // Check the value of the result
      
      for(let i = 0; i < result[0].length; i++){
        AvailCIDs[i] = result[0][i].CID;
      }

      for(let i = 0; i < result[1].length; i++){
        GIDs[i] = result[1][i].GID;
      }
  
      for(let i = 0; i < result[2].length; i++){
        CBnames[i] = result[2][i].CBname;
      }
      for(let i = 0; i < result[3].length; i++){
        PIDs[i] = result[3][i].PID;
      }
      for(let i = 0; i < result[4].length; i++){
        AllCIDs[i] = result[4][i].CID;
      }
      return [AvailCIDs, GIDs, CBnames,PIDs,AllCIDs];
    }).catch(error => {
      console.log(error); // Handle any errors
    });
  }


async function getdata_withQuery(cmd) {
    try {
        let pool = await sql.connect(config);
        let res = await pool.request().query(cmd);
        return res.recordsets;
    } catch(error){
        return error;
    }
}

function InsertInmate(InmateInfo,res)
{
  cmd = "INSERT INTO Inmates (PFirst, PLast, Gender, PSentence, PConduct, PGang, CID) VALUES ('"+ InmateInfo.PFirst +"', '"+ InmateInfo.PLast +"','"+ InmateInfo.Gender +"' ,'"+ InmateInfo.PSentence +"','"+ InmateInfo.PConduct +"', '"+ InmateInfo.PGang +"', "+ InmateInfo.CID +");";
  console.log(cmd);
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      res.redirect("/inmates");
    }
  });
}

function InsertCellBlock(CellBlockInfo,res)
{
  cmd = "INSERT INTO cellblock (CBname, CBType, NoCams) VALUES ('"+ CellBlockInfo.CBname +"', '"+ CellBlockInfo.CBType +"','"+ CellBlockInfo.NoCams +"');";
  console.log(CellBlockInfo);
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
         res.redirect("/cellblocks");
    }
  });
}
function InsertCell(CellInfo,res)
{
  console.log(CellInfo);
  cmd = "INSERT INTO cell (CellStatus, MaxCap, CBname) VALUES ('"+ CellInfo.CellStatus +"', '"+ CellInfo.MaxCap +"','"+ CellInfo.CBname +"');";
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      res.redirect("/cells");
    }
  });
}
function InsertGuard(GuardsInfo,res)
{
  cmd = "INSERT INTO Guards (GFirst, GLast, GType, Warden) VALUES ('"+ GuardsInfo.GFirst +"', '"+ GuardsInfo.GLast +"','"+ GuardsInfo.GType +"', 'False');";
  getdata_withQuery(cmd).then(result => {
      if(Object.prototype.toString.call(result) == "[object Error]"){
        console.log(typeof result);
        res.render('error', { message: 'Error', error: result});
      }
      else{
        res.redirect("/guards");
      }
  });
}

function InsertShift(ShiftInfo,res)
{
  console.log(ShiftInfo.Day);
  cmd = "INSERT INTO shifts (Day, Time_, GID, CBname) VALUES ('"+ ShiftInfo.Day +"', '"+ ShiftInfo.Time_ +"','"+ ShiftInfo.GID +"' ,'"+ ShiftInfo.CBname +"');";
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }else{
      res.redirect("/shifts");
    }
  });
}

async function DeleteInmate(PID,res){
  try{
  cmd = "DELETE FROM Inmates WHERE PID = "+ PID +";";
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      CellCountCheck();
      res.redirect("/inmates");
    }
  });
}catch(error){
  console.log(error);
}
}

async function DeleteCellBlock(CBname,res){
  try{
  cmd = "DELETE FROM cellblock WHERE CBname = '"+ CBname +"';";
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      res.redirect("/cellblocks");
    }
  });
}catch(error){
  console.log(error);
}
}

async function DeleteCell(CID,res){
  try{
  cmd = "DELETE FROM Cell WHERE CID = "+ CID +";";
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      res.redirect("/cells");
    }
  });
}catch(error){
  console.log(error);
}
}

async function DeleteGuard(GID,res){
  try{
  cmd = "DELETE FROM Guards WHERE GID = "+ GID +";";
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      UpdateGuardClearance();
      CheckForWarden();
      res.redirect("/guards");
    }
  });
}catch(error){
  console.log(error);
}
}

async function DeleteShift(Day,Time_,GID,CBname,res){
  try{
  cmd = "DELETE FROM shifts WHERE Day = '"+ Day +"' AND Time_ = '"+ Time_ +"' AND GID = "+ GID +" AND CBname = '"+ CBname +"';";
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      res.redirect("/shifts");
    }
  });
}catch(error){
  console.log(error);
}
}

async function getCellsAttributes()
{
  var cellstatuses = [];
  var maxcaps = [];
  var cbnames = [];

  cmd = "SELECT CellStatus FROM cell; SELECT MaxCap FROM cell; SELECT CBname FROM cell;";
  return getdata_withQuery(cmd).then(result => {
    //console.log(result); // Check the value of the result
    try{
      for(let i = 0; i < result[0].length; i++){
        cellstatuses[i] = result[0][i].CellStatus;
      }

      for(let i = 0; i < result[1].length; i++){
        maxcaps[i] = result[1][i].MaxCap;
      }

      for(let i = 0; i < result[2].length; i++){
        cbnames[i] = result[2][i].CBname;
      }
      return [cellstatuses, maxcaps, cbnames];
    }catch (e){
      console.log(e);
    }
   
  });
}

function UpdateCell(CellInfo,res)
{
  console.log(CellInfo);
  switch(CellInfo.selec){
      case 'cellstatus':
        cmd = "UPDATE cell SET CellStatus = '"+ CellInfo.CellStatus +"' WHERE CID = "+CellInfo.CID +";";
        break;
      case 'maxcap':
        cmd = "UPDATE cell SET MaxCap = '"+ CellInfo.MaxCap +"'WHERE CID = "+CellInfo.CID +";";
        break;
      case 'cbname':
        cmd = "UPDATE cell SET CBname = '"+ CellInfo.CBname +"WHERE CID = "+CellInfo.CID +";";
        break;
      case '':
        return;
    }
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      res.redirect("/cells");}
  });
}

function UpdateCellBlock(CBInfo,res)
{
  console.log(CBInfo);
  switch(CBInfo.selec){
      case 'cbtype':
        cmd = "UPDATE cellblock SET CBType = '"+ CBInfo.CBType +"' WHERE CBname = '"+CBInfo.CBname +"';";
        break;
      case 'noCams':
        if(CBInfo.NoCams != ''){
          cmd = "UPDATE cellblock SET NoCams = '"+ CBInfo.NoCams +"'WHERE CBname = '"+CBInfo.CBname +"';";
        }
        else{
          cmd = "UPDATE cellblock SET NoCams = NULL WHERE CBname = '"+CBInfo.CBname +"';";
        }
        break;
      case '':
        return;
    }
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      res.redirect('/cellblocks');
    }
  });
}

function UpdateGuard(GuardInfo,res)
{
  console.log(GuardInfo);
  switch(GuardInfo.selec){
      case 'gfirst':
        cmd = "UPDATE guards SET GFirst = '"+ GuardInfo.GFirst +"' WHERE GID = "+GuardInfo.GID +";";
        break;
      case 'glast':
        cmd = "UPDATE guards SET GLast = '"+ GuardInfo.GLast +"'WHERE GID = "+GuardInfo.GID +";";
        break;
      case 'gtype':
        cmd = "UPDATE guards SET GType = '"+ GuardInfo.GType +"'WHERE GID = "+GuardInfo.GID +";";
        break;
      case '':
        return;
    }
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      res.redirect('/guards');
    }
  });
}

function UpdateInmate(InmateInfo,res)
{
  console.log(InmateInfo);
  switch(InmateInfo.selec){
      case 'pfirst':
        cmd = "UPDATE inmates SET PFirst = '"+ InmateInfo.PFirst +"' WHERE PID = "+InmateInfo.PID +";";
        break;
      case 'plast':
        cmd = "UPDATE inmates SET PLast = '"+ InmateInfo.PLast +"'WHERE PID = "+InmateInfo.PID +";";
        break;
      case 'gender':
        cmd = "UPDATE inmates SET Gender = '"+ InmateInfo.Gender +"'WHERE PID = "+InmateInfo.PID +";";
        break;
      case 'psentence':
        cmd = "UPDATE inmates SET PSentence = '"+ InmateInfo.PSentence +"'WHERE PID = "+InmateInfo.PID +";";
        break;
      case 'pgang':
        cmd = "UPDATE inmates SET PGang = '"+ InmateInfo.PGang +"'WHERE PID = "+InmateInfo.PID +";";
        break;
      case 'pconduct':
        cmd = "UPDATE inmates SET PConduct = '"+ InmateInfo.PConduct +"'WHERE PID = "+InmateInfo.PID +";";
        break;
      case 'parole':
        cmd = "UPDATE inmates SET Parole = '"+ InmateInfo.Parole +"'WHERE PID = "+InmateInfo.PID +";";
        break;
      case 'cid':
        cmd = "UPDATE inmates SET CID = '"+ InmateInfo.CID +"'WHERE PID = "+InmateInfo.PID +";";
        break;
      case '':
        return;
    }
  getdata_withQuery(cmd).then(result => {
    if(Object.prototype.toString.call(result) == "[object Error]"){
      console.log(typeof result);
      res.render('error', { message: 'Error', error: result});
    }
    else{
      CellCountCheck();
      res.redirect('/inmates');
    }
  });
}

function UpdateShift(ShiftInfo,res)
{
  switch(ShiftInfo.selec){
    case 'day':
      cmd = "UPDATE Shifts SET Day = '"+ ShiftInfo.Day1 +"' WHERE Day = '"+ShiftInfo.Day +"' AND Time_ = '"+ShiftInfo.Time_ +"' AND GID = "+ShiftInfo.GID +" AND CBname = '"+ ShiftInfo.CBname +"';";
      break;
    case 'time_':
      cmd = "UPDATE Shifts SET Time_ = '"+ ShiftInfo.Time_1 +"' WHERE Day = '"+ShiftInfo.Day +"' AND Time_ = '"+ShiftInfo.Time_ +"' AND GID = "+ShiftInfo.GID +" AND CBname = '"+ ShiftInfo.CBname +"';";
      break;
    case 'gid':
      cmd = "UPDATE Shifts SET GID = '"+ ShiftInfo.GID1 +"' WHERE Day = '"+ShiftInfo.Day +"' AND Time_ = '"+ShiftInfo.Time_ +"' AND GID = "+ShiftInfo.GID +" AND CBname = '"+ ShiftInfo.CBname +"';";
      break;
    case 'cbname':
      cmd = "UPDATE Shifts SET CBname = '"+ ShiftInfo.CBname1 +"' WHERE Day = '"+ShiftInfo.Day +"' AND Time_ = '"+ShiftInfo.Time_ +"' AND GID = "+ShiftInfo.GID +" AND CBname = '"+ ShiftInfo.CBname +"';";
      break;
    case '':
      return;
  }
getdata_withQuery(cmd).then(result => {
  if(Object.prototype.toString.call(result) == "[object Error]"){
    console.log(typeof result);
    res.render('error', { message: 'Error', error: result});
  }
  else{
    CellCountCheck();
    res.redirect('/shifts');
  }
});
}

module.exports = {
    getdata: getdata,
    getForeignKeys: getForeignKeys,
    getdata_withQuery:getdata_withQuery,
    DeleteCell:DeleteCell,
    DeleteCellBlock:DeleteCellBlock,
    DeleteGuard:DeleteGuard,
    DeleteInmate:DeleteInmate,
    DeleteShift:DeleteShift,
    InsertInmate:InsertInmate,
    InsertCellBlock:InsertCellBlock,
    InsertCell:InsertCell,
    InsertGuard:InsertGuard,
    InsertShift:InsertShift,
    getCellsAttributes:getCellsAttributes,
    UpdateCell:UpdateCell,
    UpdateCellBlock:UpdateCellBlock,
    UpdateGuard:UpdateGuard,
    UpdateInmate:UpdateInmate,
    UpdateShift:UpdateShift,
    CheckForWarden:CheckForWarden,
    CountInmate:CountInmate,
    MoveInmate:MoveInmate,
    Query0:Query0,
    Query1:Query1,
    Query2:Query2,
    Query3:Query3,
    Query4:Query4,
    Query5:Query5,
    Query6:Query6,
    Query7:Query7,
    Query8:Query8,
    Query9:Query9,
    Query10:Query10,
    UpdateGuardClearance:UpdateGuardClearance,
    CellCountCheck:CellCountCheck,
    SolitaryCheck:SolitaryCheck,
    ParoleCheck:ParoleCheck
};