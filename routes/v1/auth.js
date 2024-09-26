const express = require("express");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { secret } = require("../../config/config");
const router = express.Router();

const UserModel = require("../../models/UserModel");

router.get("/cancel", function (req, res, next) {
  setTimeout(function () {
    return res.json({
      code: "1111",
      msg: "cancel",
      data: null,
    });
  }, 5000);
});

// 登录操作
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  UserModel.findOne({ username: username, password: md5(password) })
    .catch((err) => {
      return res.json({
        code: "2001",
        msg: "数据库读取失败",
        data: null,
      });
    })
    .then((data) => {
      if (!data) {
        return res.json({
          code: "2002",
          msg: "用户名或密码错误",
          data: null,
        });
      }
      // 创建token
      let token = jwt.sign(
        {
          username: data.username,
          _id: data._id,
        },
        secret,
        {
          expiresIn: 60 * 60 * 24,
        }
      );

      // 响应token
      return res.json({
        code: "0000",
        msg: "登录成功",
        data: token,
      });
    });
});

// TODO 退出登录

// 注册用户
router.post("/reg", (req, res) => {
  let { username, password } = req.body;
  //查看有无已存在用户
  UserModel.findOne({ username: username })
    .then((data) => {
      if (data == null) {
        // 新用户注册
        UserModel.create({ ...req.body, password: md5(password) })
          .then((data) => {
            return res.json({
              code: "0000",
              msg: "注册成功",
              data: null,
            });
          })
          .catch((err) => {
            return res.json({
              code: "2003",
              msg: "注册失败",
              data: null,
            });
          });
      } else {
        return res.json({
          code: "2004",
          msg: "用户名已存在，请重新注册",
          data: null,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({
        code: "2005",
        msg: "注册失败",
        data: null,
      });
    });
});

module.exports = router;
