let sql = {
    dissListSql: (obj) => {
       return 'SELECT * FROM diss'
    },
    rankingSql: (obj) => {
        return 'SELECT * FROM company order by star desc'
    },
    addSql: (obj) => {
        return 'insert into company(name, number, region, isGoOut, hopeGoOut, existence, diss, talk, star) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    },
    nameSql: function(obj) {
    	return `SELECT * FROM company WHERE name='${obj}'`
    },
    isHaveClickSql: function(obj) {
        return `Select * from user_company_van where openid = '${obj.openid}' and companyId = ${obj.companyId}`
    },
    addStarSql: function(obj) {
        return `UPDATE company SET star = ${obj.star} WHERE id = ${obj.id}`
    },
    insertOpenidCompanyIdsQL: function(obj) {
        return `INSERT INTO user_company_van (openid, companyId) VALUES ('${obj.openid}', ${obj.id})`
    }
}
module.exports = sql