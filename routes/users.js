const router = require('koa-router')()
const wx = require('../controllers/wxconfig.json'); // 文件中存储了appid 和 secret 微信小程序设置
const request = require('request'); // 处理node request请求
const jwt = require('jsonwebtoken') // 生成签名token
const allServices = require('../controllers/mysql') // 生成签名token
const user = require('../controllers/store/user') // 生成签名token
let responseData = {
    code:0,
    msg: '请求失败',
    result: false,
    data: ''
}
let isTokenFn = function(openid) {
    return new Promise((resolve, reject) => {
        allServices(user.seletUserIDSql(openid)).then(data => {
            resolve(data)
        }).catch(error => {
            reject(error)
        })
    })
}
router.prefix('/users')
// 增加用户登录接口
router.post('/login', async (ctx, next) => {
    var params = ctx.request.body;
    var code = '';
    if (params.code) {
        let options = {
            method: 'POST',
            url: 'https://api.weixin.qq.com/sns/jscode2session?',
            formData: {
                appid: wx.appid,
                secret: wx.secret,
                js_code: params.code,
                grant_type: 'authorization_code'
            }
        };
        function requestAsyncFn(options) {
            return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if(error) { // 请求异常时，返回错误信息
                    reject(error)
                } else {
                    resolve(JSON.parse(body))
                }
            });
            })
        }
        let result = await requestAsyncFn(options)
        let content = {
            openid: result.openid
        }
        let token = jwt.sign(content, 'secret', {
            expiresIn: 60*60*1  // 1小时过期
        })
        if (token) {
            let isToken = await isTokenFn(content.openid)
            if (isToken.length < 1) {
                const sqlObj = {
                    content: content.openid,
                    token: token
                }
                let addUser = await allServices(user.addUserData(sqlObj))
                if (addUser) {
                    responseData.data = {openid: content.openid}
                    responseData.msg = '登录成功'
                    responseData.result = true
                    ctx.body = responseData
                    next()
                } else {
                    responseData.data = ''
                    responseData.msg = '登录失败'
                    responseData.result = false
                    responseData.code = 0
                    ctx.body = responseData
                    next()
                }
            } else {
                let obj = {
                    token: token,
                    openid: content.openid
                }
                let updataUser = await allServices(user.updataUserIdSql(obj))
                if (updataUser) {
                    responseData.data = {openid: content.openid}
                    responseData.msg = '更新成功'
                    responseData.result = true
                    ctx.body = responseData
                    next()
                }
            }
        }
    } else {
        responseData.data = ''
        responseData.msg = '获取code失败'
        responseData.result = false
        ctx.body = responseData
        next()
    }
})
module.exports = router
