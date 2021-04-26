const express = require("express");
const jwt = require("jsonwebtoken");
const memberRouter = express.Router();
const connection = require("../../db_connect");
const authentication = require("../../auth");
const nodemailer = require("nodemailer");
const request = require("request");

const SECRET_KEY = "ju4t";

let robotOptions = {
  url: "https://www.google.com/recaptcha/api/siteverify",
  form: {
    response: "",
    secret: "6Ld1FUUaAAAAAKDSSlAFl-NELQsHRSyW3LU3YeFa",
  },
};

const mailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "587",
  secure: false,
  // service: 'gmail',
  // port: 465,
  // secure: true,
  auth: {
    user: "ju4t.phonecase@gmail.com",
    pass: "ju4tju4t",
  },
});

// 處理會員註冊
memberRouter.post("/register", async (req, res) => {
  let formData = req.body;
  let member = {
    account: formData.account,
    password: formData.password,
    name: formData.name,
    mobile: formData.mobile,
    birthday: formData.birthday,
  };
  const [result] = await connection.query(
    "SELECT `account` FROM `members` WHERE account=?",
    formData.account
  );

  if (result.length > 0) {
    res.json({
      result: "Account exist.",
    });
  } else {
    const [rows] = await connection.query("INSERT INTO `members`set ?", member);
    if (rows.affectedRows === 1) {
      res.json({
        result: "Register Success!",
      });
    } else {
      res.json({
        result: "Register Fail!",
      });
    }
  }
});

// 處理會員登入
memberRouter.post("/login", async (req, res) => {
  robotOptions.form.response = req.body.googleToken;
  let formData = req.body;

  // Google 登入 
  if (formData.id_token) {
    request(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${formData.id_token}`,
      async (googleError, googleRes, googleBody) => {
        // console.log(googleError);
        // console.log(googleRes);
        // console.log(googleBody);
        let googleMember = JSON.parse(googleBody);
        let member = {
          account: googleMember.email,
          password:"aaaa1111",
          name: googleMember.name,
          mobile: "",
          birthday: new Date,
        };
        // {
        //   "iss": "accounts.google.com",
        //   "azp": "889183140809-q98qavt42ngbgrdj95nmese3smgslpqq.apps.googleusercontent.com",
        //   "aud": "889183140809-q98qavt42ngbgrdj95nmese3smgslpqq.apps.googleusercontent.com",
        //   "sub": "101310191578537016343",
        //   "email": "ju4t.phonecase@gmail.com",
        //   "email_verified": "true",
        //   "at_hash": "cqVGnH1ABh-ahmdlRJaXcg",
        //   "name": "phonecase ju4t",
        //   "picture": "https://lh3.googleusercontent.com/a-/AOh14GjiWyJVeh6wnBpdMZyKkUGIQBMFr21ns34mvLue=s96-c",
        //   "given_name": "phonecase",
        //   "family_name": "ju4t",
        //   "locale": "zh-TW",
        //   "iat": "1614262423",
        //   "exp": "1614266023",
        //   "jti": "7746f36317777eb2a61fd4234845aa595142bd14",
        //   "alg": "RS256",
        //   "kid": "fed80fec56db99233d4b4f60fbafdbaeb9186c73",
        //   "typ": "JWT"
        // }
        if (member.account.length > 0) {
          const [rows1] = await connection.query(
            "SELECT * FROM `members` WHERE account=?",
            member.account
          );
          if (rows1 && rows1.length > 0) {
            let result = rows1[0];
            let payload = {
              sid: result.sid,
              account: result.account,
              name: result.name,
              birthday: result.birthday,
            };
            let token = jwt.sign(payload , SECRET_KEY, { expiresIn: "1d" });
            res.status(200).json({ result: "Bearer " + token });
          } else {
            let [rows2]  = await connection.query("INSERT INTO `members`set ?", member);
            if (rows2 && rows2.insertId) {
              let newMember = {
                sid: rows2.insertId,
                account: member.account,
                name: member.name,
                birthday: member.birthday,
                mobile: member.mobile
              }
              let token = jwt.sign(newMember, SECRET_KEY, { expiresIn: "1d" });
              res.status(200).json({ result: "Bearer " + token });
            } else {
              res.json({
                result: "DATABASE_ERROR",
              });
            }
          }
        } else {
          console.log("google登入失敗");
        }
        // res.json(googleMember.email);
      }
    );
  } else {
    // 驗證機器人
    request.post(robotOptions, async (googleError, googleRes, googleBody) => {
      console.log(googleError);
      console.log(googleRes);
      console.log(googleBody);
      let googleJsonBody = JSON.parse(googleBody);
      if (googleJsonBody.success) {
        try {
          const [
            rows,
          ] = await connection.query(
            `SELECT * FROM members WHERE account = ? AND password =  ? `,
            [req.body.account, req.body.password]
          );
          // rows判斷兩個基本條件：1.為true，即非為null或undefined 2.至少有1筆符合條件的資料
          if (rows && rows.length > 0) {
            // 選取第一筆符合條件的資料
            let result = rows[0];
            // 物件
            let payload = {
              sid: result.sid,
              account: result.account,
              name: result.name,
              birthday: result.birthday,
            };
            let token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
            res.status(200).json({ result: "Bearer " + token });
          } else {
            res.json({
              result: "MEMBER_DATA_ERROR",
            });
          }
        } catch (error) {
          console.log(error);
          res.json({
            result: "SERVER_ERROR",
          });
        }
      } else {
        res.json({
          result: "ROBOT_VERIFY_FAIL",
        });
      }
    });
  }
});

// 處理會員資料讀取
memberRouter.get("/profile", async (req, res) => {
  let authResult = authentication(req);
  if (authResult) {
    const [
      rows,
    ] = await connection.query(
      "SELECT name, birthday, mobile FROM members WHERE sid = ?",
      [authResult.sid]
    );
    if (rows && rows[0]) {
      let member = rows[0];
      res.json({
        result: "GET_MEMBER_PROFILE",
        body: member,
      });
    } else {
      res.json({
        result: "MEMBER_PROFILE_NOT_FOUND",
      });
    }
  } else {
    res.json({
      result: "INVALID_TOKEN",
    });
  }
});

// 處理會員資料更新
memberRouter.put("/editprofile", async (req, res) => {
  let formData = req.body;
  let authResult = authentication(req);

  if (authResult) {
    const [
      result,
    ] = await connection.query("SELECT `password` FROM `members` WHERE sid=?", [
      authResult.sid,
    ]);

    if (result[0].password === formData.password) {
      let member = {
        name: formData.name,
        birthday: formData.birthday,
        mobile: formData.mobile
      };

      const [
        rows,
      ] = await connection.query("UPDATE `members` SET ? WHERE sid = ?", [
        member,
        authResult.sid,
      ]);
      const [
        rows2,
      ] = await connection.query(
        "SELECT name, birthday, mobile FROM `members` WHERE sid=?",
        [authResult.sid]
      );

      if (rows.changedRows === 1) {
        res.json({
          result: "更新成功!",
          body: req.body,
        });
      } else if (rows2.length === 1) {
        res.json({
          result: "資料未更新!",
        });
      }
    } else {
      res.json({
        result: "密碼錯誤!",
      });
    }
  } else {
    res.json({
      result: "INVALID_TOKEN",
    });
  }
});

// 處理會員密碼更新
memberRouter.put("/editpassword", async (req, res) => {
  let formData = req.body;
  let authResult = authentication(req);

  if (authResult) {
    const [
      result,
    ] = await connection.query(
      "SELECT `password` FROM `members` WHERE sid = ?",
      [authResult.sid]
    );

    if (result && result[0].password === formData.password) {
      const [
        rows,
      ] = await connection.query(
        "UPDATE `members` SET password = ? WHERE sid = ?",
        [formData.newpassword, authResult.sid]
      );
      const [
        rows2,
      ] = await connection.query(
        "SELECT `password` FROM `members` WHERE sid=?",
        [authResult.sid]
      );

      if (rows.changedRows === 1) {
        res.json({
          result: "更新成功!",
        });
      } else if (rows2.length === 1) {
        res.json({
          result: "資料未更新!",
        });
      }
    } else {
      res.json({
        result: "密碼錯誤",
      });
    }
  } else {
    res.json({
      result: "INVALID_TOKEN",
    });
  }
});

// 處理忘記密碼
memberRouter.post("/forget", async (req, res) => {
  let formData = req.body;

  // // 亂數產生
  // function randomusefloor(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1) + min);
  // }
  // // 亂數英文字
  // function makerandomletter(max) {
  //   var text = "";
  //   var possible = "abcdefghijklmnopqrstuvwxyz";

  //   for (var i = 0; i < max; i++)
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   return text;
  // }

  const [
    result,
  ] = await connection.query(
    "SELECT sid, name, account, birthday, mobile FROM `members` WHERE account = ?  AND  mobile = ? AND birthday = ?",
    [formData.account, formData.mobile, formData.birthday]
  );

  if (result[0]) {
    // 前兩碼英文小寫,後6碼數字
    let member = {
      // password: makerandomletter(2) + randomusefloor(1, 999999),
      password:"JZ483703",
    };
    const [
      rows,
    ] = await connection.query("UPDATE `members` SET ? WHERE sid = ?", [
      member,
      result[0].sid,
    ]);

    if (rows.changedRows === 1) {
      // sendResetPasswordMail(res, formData.account, member.password);
      let mailOptions = {
        from: "ju4t.phonecase@gmail.com",
        to: formData.account,
        subject: "JU4T - 忘記密碼申請通知",
        html:
          "<h2>親愛的" +
          result[0].name +
          "，\n" +
          "</h2>" +
          "<h2>已收到您的密碼變更申請，請使用下方新密碼登入，並至會員中心 > 密碼變更，更換新密碼。</h2>" +
          "<h2>您的新密碼為：" +
          member.password +
          "\n" +
          "</h2>" +
          "<h2>請點此連結使用新密碼登入官網，並更換密碼：<a href = http://localhost:3000/member/login>Ju4t 官網</a></h2>" +
          "<h4>注意：本郵件由系統自動產生與發送，請勿直接回覆。</h4>",
      };

      mailTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.json({
            result: "UPDATE_FAIL",
          });
          console.log("Fail to send mail - " + error);
        } else {
          res.json({
            result: "UPDATE_PASSWORD_SUCCESS",
            body: req.body,
          });
          console.log("Email sent: " + info.response);
        }
      });
    } else {
      res.json({
        result: "UPDATE_FAIL",
      });
    }
  } else {
    res.json({
      result: "ACCOUNT_MOBILE_OR_BIRTHDAY_ERROR",
    });
  }
});

// 處理訂單紀錄
memberRouter.get("/order", async (req, res) => {
  let authResult = authentication(req);
  if (authResult) {
    const [
      rows,
    ] = await connection.query(
      "SELECT * FROM `order_list` WHERE member_id = ?",
      [authResult.sid]
    );
    if (rows && rows[0]) {
      res.json({
        result: "GET_ORDERLIST_DATA",
        body: rows,
      });
    } else {
      res.json({
        result: "NO_MATCH_DATA",
      });
    }
  } else {
    res.json({
      result: "INVALID_TOKEN",
    });
  }
});

// 處理訂單明細
memberRouter.get("/orderdetail/:orderid", async (req, res) => {
  let orderid = req.params.orderid;
  let authResult = authentication(req);
  if (authResult) {
    const [
      rows,
    ] = await connection.query(
      "SELECT od.order_id , od.model_id , od.per_price , od.quantity , od.phoneColor, pshell.shell_color_chn,pshell.shell_color_en , pseries.series_name_chn , pseries.series_name_eng , pdesign.design_name_chn , pdesign.design_name_eng , ol.payway , ol.getway, ol.address, ol.taker, ol.taker_phone, ol.discount, filepath FROM order_detail od  JOIN phone_shells pshell ON pshell.id = od.shell_id  JOIN phone_series pseries on pseries.id = od.series_id   JOIN phone_designs pdesign on pdesign.id = od.design_id  JOIN order_list ol on ol.unique_id = od.order_id WHERE od.order_id = ?",
      [orderid]
    );
    if (rows && rows[0]) {
      res.json({
        result: "GET_ORDERDETAIL_DATA",
        body: rows,
      });
    } else {
      res.json({
        result: "NO_MATCH_DATA",
      });
    }
  } else {
    res.json({
      result: "INVALID_TOKEN",
    });
  }
});

// 處理我的優惠券
memberRouter.get("/coupon", async (req, res) => {
  let authResult = authentication(req);
  if (authResult) {
    const [
      rows,
    ] = await connection.query("SELECT * FROM coupon WHERE member_sid = ?", [
      authResult.sid,
    ]);
    if (rows && rows[0]) {
      res.json({
        result: "GET_COUPON_DATA",
        body: rows,
      });
    } else {
      res.json({
        result: "NO_MATCH_DATA",
      });
    }
  } else {
    res.json({
      result: "INVALID_TOKEN",
    });
  }
});

module.exports = memberRouter;
