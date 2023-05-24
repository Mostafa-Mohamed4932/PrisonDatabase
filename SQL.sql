SELECT * FROM Inmates WHERE CAST(PSentence AS INT) > '30' AND PSentence != 'Death Sentence';
SELECT * FROM Guards WHERE Clearance > 1;
SELECT Inmates.* FROM Inmates INNER JOIN Cell ON Inmates.CID = Cell.CID INNER JOIN CellBlock ON Cell.CBname = CellBlock.CBname WHERE CellBlock.CBType = 'Normal';
SELECT CellBlock.CBType FROM CellBlock INNER JOIN Shifts ON CellBlock.CBname = Shifts.CBname INNER JOIN Guards ON Shifts.GID = Guards.GID WHERE Guards.GID = 100;
SELECT CBname, COUNT(*) AS num_shifts FROM Shifts GROUP BY CBname;
SELECT COUNT(*) AS NoCells FROM Cell WHERE CBname = 'CB_A';
SELECT * FROM CellBlock WHERE CBType LIKE 'Nor';
SELECT Shifts.CBname, Count(*) AS NoGuards From Guards JOIN Shifts ON Guards.GID = Shifts.GID GROUP BY(Shifts.CBname);
SELECT Cell.CBname, Cell.CID, COUNT(*) AS NoInmates FROM Inmates JOIN Cell ON Inmates.CID = Cell.CID GROUP BY Cell.CBname, Cell.CID;
SELECT CID FROM Cell WHERE CBname = 'CB_A' OR MaxCap = 3;
SELECT * FROM Cell LEFT JOIN Inmates ON Cell.CID = Inmates.CID WHERE Inmates.CID IS NULL;
SELECT GID FROM Guards WHERE GType = 'Warden' OR Clearance = 0 OR Warden = 'True';
UPDATE Guards SET Clearance = 1, GType = 'Riot Unit', Warden = 0 WHERE GID IN (SELECT GID FROM Guards WHERE GType = 'Warden' OR Clearance = 0 OR Warden = 'True');
INSERT INTO Inmates (PFirst, PLast, Gender, PSentence, PConduct, PGang, CID) VALUES ('Samy', 'Adel','M' ,'10','Bad"', '', 10000);
INSERT INTO cellblock (CBname, CBType, NoCams) VALUES ('CB_QWQ', 'Normal',100);
INSERT INTO cell (CellStatus, MaxCap, CBname) VALUES ('Empty', '1','CB_QWQ');
INSERT INTO Guards (GFirst, GLast, GType, Warden) VALUES ('Mohsen', 'Ahmed','CCTV Opertator', 'False');
INSERT INTO shifts (Day, Time_, GID, CBname) VALUES ('Sunday', 'Day',100 ,'CB_QWQ');
SELECT * FROM CellBlock;
SELECT * FROM Cell;
SELECT * FROM Guards
SELECT * FROM Inmates;
SELECT * FROM Shifts;
CREATE TABLE CellBlock (
CBname VARCHAR(50) PRIMARY KEY,
CBType VARCHAR(50),
NoCams INT
);
CREATE TABLE Cell (
CID INT PRIMARY KEY,
CBname VARCHAR(50),
CellStatus VARCHAR(50),
MaxCap INT,
FOREIGN KEY (CBname) REFERENCES CellBlock(CBname)
);
CREATE TABLE Inmates (
PFirst VARCHAR(50),
PLast VARCHAR(50),
PID INT PRIMARY KEY,
Gender CHAR,
PSentence INT,
PGang VARCHAR(50),
PConduct VARCHAR(50),
Parole VARCHAR(3),
CID INT,
FOREIGN KEY (CID) REFERENCES Cell(CID)
);
CREATE TABLE Guards (
GFirst VARCHAR(50),
GLast VARCHAR(50),
GID INT PRIMARY KEY,
GType VARCHAR(50),
Clearance INT NULL,
Warden BIT NOT NULL
);
CREATE TABLE Shifts (
Day VARCHAR(50),
Time_ VARCHAR(50),
GID INT,
CBname VARCHAR(50),
PRIMARY KEY(Day,Time_,GID,CBname),
FOREIGN KEY (CBname) REFERENCES CellBlock(CBname),
FOREIGN KEY (GID) REFERENCES Guards(GID)
);