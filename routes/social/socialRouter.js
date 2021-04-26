const express = require("express");
const socialRouter = express.Router();
const connection = require("../../db_connect");
// const upload = require("../../upload-imgs");
var multer = require("multer");
var path = require("path");
const { v4: uuidv4 } = require("uuid");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../ju4t_final_frontend/public/img/social/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname)); //Appending extension
  },
});
// 使用上面定義的storage設定,來建立multer
var upload = multer({ storage: storage });

// 上傳檔案
socialRouter.post(
  "/addnewdata",
  // 抓imgPosted此欄位做multer做存檔及命名
  upload.single("imgPosted"),
  async (req, res) => {
    const userMemberID = req.body.member_id;
    const userName = req.body.name;
    // req.file = imgPosted欄位的檔案資訊 ex.filename.path
    const userImg = req.file;

    // 測試是否有取得資料
    // return res.json({ userMemberID, userName, userImg });

    const [
      rows,
    ] = await connection.query(
      "INSERT INTO `social`( `member_id`, `name`,`img`) VALUES (?,?,?)",
      [userMemberID, userName, userImg.filename]
    );
    if (rows.affectedRows === 1) {
      res.json({
        success: true,
        body: req.body,
      });
    } else {
      res.json({
        success: false,
        body: req.body,
      });
    }
  }
);

// 上傳檔案multer
// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");

// const extMap = {
//   "image/jpeg": ".jpg",
//   "image/png": ".png",
//   "image/gif": ".gif",
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, __dirname + "/../../public/socialImg");
//   },
//   filename: function (req, file, cb) {
//     cb(null, uuidv4() + extMap[file.mimetype]);
//   },
// });

// const fileFilter = function (req, file, cb) {
//   cb(null, !!extMap[file.mimetype]);
// };

// module.exports = multer({ storage, fileFilter });

// 是否上傳
socialRouter.get("/isposted", async (req, res) => {
  const sql_statement = "SELECT * FROM social WHERE member_id = ?";

  const [rows] = await connection.execute(sql_statement, [req.query.member_id]);
  console.log(rows == 0);
  if (rows != 0) {
    res.json({
      isPost: true,
      social_sid: rows[0].sid,
    });
  } else {
    res.json({
      isLog: false,
    });
  }
});

// slidCard's addWatch
socialRouter.post("/addwatch", async (req, res) => {
  const watchNum = req.body.watchNumber + 1;
  const userID = req.body.sid;
  const [
    rows,
  ] = await connection.query(
    "UPDATE `social` SET `watchNumber` = ? WHERE `social`.`sid` = ?",
    [watchNum, userID]
  );
  if (rows.affectedRows === 1) {
    res.json({
      success: true,
      body: req.body,
    });
  } else {
    res.json({
      success: false,
      body: req.body,
    });
  }
});

// slidCard's addHeart
socialRouter.post("/addheart", async (req, res) => {
  const heartNum = req.body.heartNumber + 1;
  const userID = req.body.sid;
  const [
    rows,
  ] = await connection.query(
    "UPDATE `social` SET `heartNumber` = ? WHERE `social`.`sid` = ?",
    [heartNum, userID]
  );
  if (rows.affectedRows === 1) {
    res.json({
      success: true,
      body: req.body,
    });
  } else {
    res.json({
      success: false,
      body: req.body,
    });
  }
});

// 抓取個別資料_2
socialRouter.get("/individual2", async (req, res) => {
  const sql_statement = "SELECT * FROM social WHERE member_id = ?";
  const [rows] = await connection.execute(sql_statement, [req.query.member_id]);
  res.send(rows);
});

// 抓取個別資料_1
socialRouter.get("/individual", async (req, res) => {
  const sql_statement = "SELECT * FROM `social` WHERE sid = ?";
  const [rows] = await connection.execute(sql_statement, [req.query.sid]);
  res.send(rows);
});

// 抓取social全部資料
socialRouter.get("/all", async (req, res) => {
  const sql_statement = "SELECT * FROM `social`";
  const [rows] = await connection.execute(sql_statement);
  res.send(rows);
});

// test 1
socialRouter.get("/test-1", async (req, res) => {
  const sql_statement = "SELECT * FROM `social` ORDER BY `created_at` DESC";

  const [rows] = await connection.execute(sql_statement);

  res.send(rows);
});

// test 2
socialRouter.get("/test-2", async (req, res) => {
  const sql_statement = "SELECT * FROM `social` WHERE sid = ? AND  name= ?";

  const [rows] = await connection.execute(sql_statement, [
    req.query.sid,
    req.query.name,
  ]);

  res.send(rows);
});

module.exports = socialRouter;
