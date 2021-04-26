const express = require("express");
const ordersRouter = express.Router();
const db = require("../../db_connect");
const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");

ordersRouter.get("/checkout", (req, res) => {
  res.send("yoooooo");
});

ordersRouter.post("/cartfinal", upload.none(), async (req, res) => {
  // check if oldToken is in req.body

  // no oldToken data, so just store req.body directy in cartArr

  let token = jwt.sign(
    { data: req.body.data },
    "kdmf8g#*Dp04bbc!qp09jf%xoliwuhmi6wf36fk"
  );

  // send token
  res.send(token);
});

ordersRouter.post("/checkout", upload.none(), async (req, res) => {
  const newOBJ = { ...req.body };
  const member_id = req.body.member_id;
  const price = req.body.price;
  const payway = req.body.payway;
  const getway = req.body.getway;
  const address = req.body.address;
  const store = req.body.store;
  const taker = req.body.taker;
  const taker_phone = req.body.taker_phone;
  const status = req.body.status;
  const discount = req.body.discount;
  // console.log(discount);
  const orderList = {
    member_id,
    price,
    payway,
    getway,
    address,
    store,
    taker,
    taker_phone,
    status,
    discount,
  };
  // console.log(req.body);

  //建單時間
  orderList.created_at = new Date();
  //用dateNOW當作單號
  const orderID = Math.floor(Date.now() / 1000);
  orderList.unique_id = orderID;

  const orderDetail = {};

  // 取得[item0,item1....]
  const idList = Object.keys(newOBJ).filter((v) => {
    return v.includes("item");
  });
  // console.log(idList);
  // 把購物車內容推進去orderDetail[]裡面
  for (let i = 0; i < idList.length; i++) {
    orderDetail[`item${i}`] = {};

    const temp = req.body[idList[i]].split(",");
    // console.log(temp);
    orderDetail[`item${i}`].order_id = orderList.unique_id;
    orderDetail[`item${i}`].model_id = temp[0];
    orderDetail[`item${i}`].shell_id = temp[1];
    orderDetail[`item${i}`].series_id = temp[2];
    orderDetail[`item${i}`].design_id = temp[3];
    orderDetail[`item${i}`].per_price = temp[4];
    orderDetail[`item${i}`].quantity = temp[5];
    orderDetail[`item${i}`].phoneColor = temp[6];
    orderDetail[`item${i}`].filepath = temp[7];
    //  orderDetail.push(req.body[idList[i]]);
  }
  // console.log(orderDetail);

  const [rowList] = await db.query("INSERT INTO `order_list` SET ?", [
    orderList,
  ]);
  if (rowList.affectedRows) {
    for (let item in orderDetail) {
      const [rowDetail] = await db.query(
        "INSERT INTO `order_detail` SET ?",
        orderDetail[item]
      );
      if (!rowDetail.affectedRows) break;
    }

    if (rowList.affectedRows === 1) {
      res.json({
        success: true,
        orderDetail: orderDetail,
        orderList: orderList,
      });
    } else {
      res.json({
        success: false,
        orderDetail: orderDetail,
        orderList: orderList,
      });
    }
  }
});

module.exports = ordersRouter;
