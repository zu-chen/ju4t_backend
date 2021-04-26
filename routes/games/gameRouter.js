const express = require("express");
const gameRouter = express.Router();
const db = require("../../db_connect");
const multer = require("multer");
const upload = multer();

gameRouter.post("/coupon",upload.none(), async(req, res) => {
  const getdate = new Date()
  //前端的資料
  const {  member_sid,coupon_name, status,}=req.body;
  const data={member_sid,coupon_name, status,getdate};
  const [reault]=await db.query("INSERT INTO `coupon` SET ?",[data])
 console.log(reault)
 res.json(
    req.body
   );
});

module.exports = gameRouter;
