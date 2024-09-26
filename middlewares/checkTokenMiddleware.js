const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
module.exports = (req, res, next) => {
    // 获取token
    let token = req.get('token');
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token缺失',
            data: null
        });
    }

    // 校验 token
    jwt.verify(token, secret, (err, data) => {
        // 检测 token 是否正确
        if (err) {
            return res.json({
                code: '2004',
                msg: 'token 校验失败',
                data: null
            });
        }
        // 保存jwt校验后返回的用户信息
        req.user = data;
        next();
    });
}