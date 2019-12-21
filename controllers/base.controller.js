
module.exports.home = (req, res) => {
    res.redirect(`/user/${req.currentUser.nickName}`)
}