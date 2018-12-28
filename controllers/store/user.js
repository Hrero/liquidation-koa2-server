let sql = {
    addUserData: (obj) => {
        return `INSERT INTO users(openid,token) VALUES ('${obj.openid}', '${obj.token}')`
    },
    seletUserIDSql: (openid) => {
        return `SELECT * FROM users WHERE openid='${openid}'`
    },
    updataUserIdSql: (obj) => {
        return `UPDATE users SET token = '${obj.token}' WHERE openid = '${obj.openid}' `
    }
}
module.exports = sql