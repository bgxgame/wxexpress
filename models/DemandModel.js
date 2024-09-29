const mongoose = require('mongoose');

let DemandSchema = new mongoose.Schema({
    // 需求num
    demand_num: String,
    // 需求名称
    demand_name: String,
    // 业务部门
    business_department: String,
    // 上游系统
    up_sys: String,
    // 下游系统
    down_sys: String,
    // 是否需要etl加工
    or_etl: String,
    // 数据粒度
    data_granularity: String,
    // 数据链路
    data_chain: String,
    // 数据接入
    access_data: String,
    // 数据下发
    data_distribution: String,
    // 处理逻辑
    processing_logic: String,
    // 需求状态
    demand_status: String,
    // 牵头人
    initiator: String,
    // 需求分析负责人
    initiator2: String,
    // 需求开发负责人
    initiator3: String,
    // 开发完成时间
    sit_time: Date,
    // 打包完成时间
    uat_time: Date,
    // 上线时间
    prd_time: Date
});

// 创建模型对象 对文档操作的封装对象
let DemandModel = mongoose.model('demand_list', DemandSchema);

// 暴露模型对象
module.exports = DemandModel;