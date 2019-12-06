const User = require('../models/user.model')

module.exports.login = (_, res) => {
    res.render('user/login')
}

module.exports.new = (_, res) => {
    res.render('user/new')
}