const express = require("express");
const moment = require("moment");
// 导入中间件
const checkTokenMiddleware = require("../../middlewares/checkTokenMiddleware");
const DemandModel = require("../../models/DemandModel");
const router = express.Router();

// 需求列表
router.get("/demands", checkTokenMiddleware, function (req, res, next) {
  // 获取由中间件挂载的用户信息
  console.log(req.user);

  // 拿到所有任务信息
  DemandModel.find()
    .sort({ prd_time: -1 })
    .exec()
    .then((data) => {
      res.json({
        // 响应编码
        code: "0000",
        // 响应的信息
        msg: "读取成功",
        // 响应的数据
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        // 响应编码
        code: "1001",
        // 响应的信息
        msg: "读取失败",
        // 响应的数据
        data: null,
      });
      return;
    });
});

// 新增记录
router.post("/demand", checkTokenMiddleware, function (req, res, next) {
  // TODO 表单验证
  DemandModel.create({
    ...req.body,
    // 覆盖req.body.time
    // sit_time: moment(req.body.sit_time).toDate(),
    // uat_time: moment(req.body.uat_time).toDate(),
    // prd_time: moment(req.body.prd_time).toDate(),
    sit_time: req.body.sit_time,
    uat_time: req.body.uat_time,
    prd_time: req.body.prd_time,
  })
    .then((data) => {
      res.json({
        code: "0000",
        msg: "创建成功",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        code: "1002",
        msg: "新增失败",
        data: null,
      });
      return;
    });
});

// 删除记录 params
router.delete("/demand/:id", checkTokenMiddleware, function (req, res, next) {
  // 获取 params 的id参数
  let id = req.params.id;
  // 删除
  DemandModel.deleteOne({ _id: id })
    .then((data) => {
      res.json({
        code: "0000",
        msg: "删除成功",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        code: "1003",
        msg: "删除失败",
        data: null,
      });
      return;
    });
});

// 获取单个记录
router.get("/demand/:id", checkTokenMiddleware, function (req, res, next) {
  // 获取 params 的id参数
  let { id } = req.params;
  DemandModel.findById(id)
    .then((data) => {
      if (!data) {
        return res.json({
          code: "1004",
          msg: "记录ID或许有误",
          data: null,
        });
      }
      res.json({
        code: "0000",
        msg: "获取单个记录成功",
        data: data,
      });
    })
    .catch((err) => {
      return res.json({
        code: "1005",
        msg: "获取单个记录失败",
        data: null,
      });
    }); 
});

// 更新单个记录
router.patch("/demand/:id", checkTokenMiddleware, function (req, res, next) {
  // 获取 params 的id参数
  let { id } = req.params;
  DemandModel.updateOne({ _id: id }, req.body).catch((err) => {
    res.json({
      code: "1006",
      msg: "更新单个记录失败",
      data: null,
    });
    return;
  });

  // 再次查询数据库，获取单条数据
  DemandModel.findById(id)
    .catch((err) => {
      res.json({
        code: "1007",
        msg: "获取单个记录失败",
        data: null,
      });
      return;
    })
    .then((reAccResData) => {
      res.json({
        code: "0000",
        msg: "更新单个记录成功",
        data: reAccResData,
      });
    });
});
module.exports = router;
