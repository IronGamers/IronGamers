
module.exports.home = (_, res) => {
    res.redirect(`/user/${currentUser.nickName}`)
}