/**
 * 
 * @param {*} success 数据库连接成功回调
 * @param {*} error 数据库连接失败回调
 */
module.exports = function (success, error) {
    if (typeof error !== 'function') {
        error = () => {
            console.log('连接失败');
        }
    }
    const mongoose = require('mongoose');
    const { DBHOST, DBPORT, DBNAME ,DBUSER,DBPASSWORD} = require('../config/config');

    mongoose.connect(`mongodb://${DBUSER}:${DBPASSWORD}@${DBHOST}:${DBPORT}/${DBNAME}`);

    // 设置回调
    mongoose.connection.on('open', () => {
        console.log(`db ${DBHOST}:${DBPORT}/${DBNAME} 连接成功`);
        success()
    });

    mongoose.connection.on('error', () => {
        console.log(`db ${DBHOST}:${DBPORT}/${DBNAME} 连接错误`);
        error()
    });

    mongoose.connection.on('close', () => {
        console.log(`db ${DBHOST}:${DBPORT}/${DBNAME} 连接关闭`);
    });

}