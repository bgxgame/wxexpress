const express = require("express");
// 导入中间件
const checkTokenMiddleware = require("../../middlewares/checkTokenMiddleware");
const DemandModel = require("../../models/DemandModel");
const { removeEmptyValues } = require("../../utils/common");
const router = express.Router();

//需求总数
router.post("/count/demands", checkTokenMiddleware, function (req, res, next) {
  // 获取由中间件挂载的用户信息
  console.log(req.user);
  //   查询条件
  const match = req.body.match;
  //   分组信息
  const group = req.body.group;
  // count任务信息
  DemandModel.aggregate([{ $match: match }, { $group: group }])
    .exec()
    .then((data) => {
      res.json({
        // 响应编码
        code: "0000",
        // 响应的信息
        msg: "查询需求总数成功",
        // 响应的数据
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);

      res.json({
        // 响应编码
        code: "3001",
        // 响应的信息
        msg: "查询需求总数失败",
        // 响应的数据
        data: null,
      });
      return;
    });
});
module.exports = router;
