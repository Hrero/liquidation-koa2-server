const router = require('koa-router')()
const wx = require('../controllers/wxconfig.json'); // 文件中存储了appid 和 secret 微信小程序设置
const request = require('request'); // 处理node request请求
const jwt = require('jsonwebtoken') // 生成签名token
const allServices = require('../controllers/mysql') // 生成签名token
const company = require('../controllers/store/company') // 生成签名token

function resData(obj) {
    obj.code = obj.code || 0
    obj.msg = obj.msg || '请求失败'
    obj.result = obj.result || false
    obj.data = obj.data || ''
    return obj
}
router.prefix('/company')
// 鄙视列表
router.post('/getDissSelect', async (ctx, next) => {
    await allServices(company.dissListSql()).then((data) => {
        ctx.body = resData({msg: '请求成功', result: true, data: data})
        next()
    }).catch(error => {
        ctx.body = resData()
    })
})
// 排行列表
router.post('/getRankingList', async (ctx, next) => {
    await allServices(company.rankingSql()).then((data) => {
        ctx.body = resData({msg: '请求成功', result: true, data: data})
        next()
    }).catch(error => {
        ctx.body = resData()
    })
})
// 添加接口
router.post('/addCompany', async (ctx, next) => {
    const req = ctx.request.body
    let data = await allServices(company.nameSql(req.name))
    if (data.length < 1) {
        await allServices(company.addSql(), [req.name,req.number,req.region,req.isGoOut,req.hopeGoOut,req.existence,req.diss,req.talk,req.star]).then((data) => {
            ctx.body = resData({data: '', msg: '收到了,老板', result: true, code: 1})
            next()
        }).catch(error => {
            console.log(error)
        })
    } else {
        ctx.body = resData({msg: '我要被你点爆了'})
    }
})

//点赞接口
router.post('/addStar', async (ctx, next) => {
    const req = ctx.request.body
    let isHaveClickStarFn = function(openid, companyId) {
        return new Promise((resolve, reject) => {
            let obj = {
                openid: openid,
                companyId: companyId
            }
            allServices(company.isHaveClickSql(obj)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
    let data = await isHaveClickStarFn(req.openid, req.id)
    if (data.length > 0) {
        ctx.body = resData({data: '', msg: '您已经支持过一次了哦！', result: true, code: 1})
        next()
    } else {
        await allServices(company.addStarSql(req))
        await allServices(company.insertOpenidCompanyIdsQL(req)).then((err, data) => {
            if (data) {
                ctx.body = resData({data: '', msg: '收到了,老板', result: true, code: 1})
            }
            if (err) {
                console.log(err);
            }
            next()
        })
    }
})
module.exports = router
