const company = require('./company')
const users = require('./users')

module.exports = function(app){
    app.use(users.routes()).use(users.allowedMethods());
    app.use(company.routes()).use(company.allowedMethods());
}
