const User = require('../models/user.model')
const mongoose = require('mongoose')
const PrivateMessage = require('../models/private-message-model')

module.exports.login = (_, res) => {
	res.render('user/login')
}

module.exports.new = (_, res) => {
	res.render('user/new')
}

module.exports.detailUser = (req, res, next) =>{
	const nickName = req.params.nickName
	User.findOne({nickName: nickName})
	.then(user => {
		res.render('user/userDetail', {user})
	})
	
}

module.exports.create = (req, res, next) => {
	const user = new User({
		name: req.body.name,
		lastname: req.body.lastname,
		nickName: req.body.nickname,
		email: req.body.email,
		password: req.body.password,
		avatar: req.body.avatar
	})

	if (!req.body.avatar) {
		user.avatar = 'https://picsum.photos/200'
	}

	user.save()
		.then((user) => {
			res.redirect('/user/login')
			console.log(user)
		})
		.catch(error => {
			console.log(error)
			if (error instanceof mongoose.Error.ValidationError) {
				res.render('user/new', {
					user,
					error: error.errors
				})
			} else if (error.code === 11000) {
				res.render('users/new', {
					user: {
						...user,
						password: null
					},
					genericError: 'El usuario ya existe'
				})
			} else {
				next(error);
			}
		})
}

module.exports.doLogin = (req, res, next) => {
    const {
        nickName,
        password
    } = req.body

    if (!nickName || !password) {
        return res.render('user/login', {
            user: req.body
        })
    }

    User.findOne({
            nickName: nickName,
            validated: true
        })
        .then(user => {
            if (!user) {
                res.render('users/login', {
                    user: req.body,
                    error: {
                        password: 'invalid password'
                    }
                })
            } else {
                return user.checkPassword(password)
                    .then(match => {
                        if (!match) {
                            res.render('user/login', {
                                user: req.body,
                                error: {
                                    password: 'invalid password'
                                }
                            })
                        } else {
                            req.session.user = user
                            req.session.genericSuccess = 'Welcome!'
                            res.redirect(`/user/${user._id}`)
                        }
                    })
            }
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('user/login', {
                    user: req.body,
                    error: error.error
                })
            } else {
                next(error)
            }
        });
}

module.exports.logout = (req, res, next) => {
	req.session.destroy()
	res.redirect('/user/login')
}

module.exports.userList = (req, res, next) => {
	User.find()
		.then(users => {
			res.render('admin/userList', { users })
		})
		.catch(error => next(error))
}

module.exports.delete = (req, res, next) => {
	const nickName = req.body.nickName
	console.log(req.body)
	User.findOneAndDelete({ nickName: nickName })
		.then(
			res.redirect('/admin/users')
		)
}

module.exports.changeRol = (req, res, next) => {
	const id = req.params.id
	const rol = req.body.rol

	User.findByIdAndUpdate(id, { rol: rol })
		.then(user => {
			res.json(user.rol)
		})
		.catch(error => next(error))

}

module.exports.showInbox = (req, res, next) => {

	const myID = req.currentUser._id
	PrivateMessage.find({ destinationUser: "5df7b83e0e5c141e2cca12a6" })
		.populate('myUser')
		.populate('destinationUser')
		.then(messages => {
			res.render('user/inbox', { messages })
		})
		.catch(error => console.log("Error showing messages => ", error))

}