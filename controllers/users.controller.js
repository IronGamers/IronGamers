const User = require('../models/user.model')
const mongoose = require('mongoose')
const PrivateMessage = require('../models/private-message-model')

module.exports.login = (_, res) => {
	res.render('user/login')
}

module.exports.new = (_, res) => {
	res.render('user/new')
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
							res.redirect('/games/list')
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

// MESSAGES
module.exports.showInbox = (req, res, next) => {

	const myID = req.currentUser._id
	PrivateMessage.find({ destinationUser: myID })
		.populate('myUser')
		.populate('destinationUser')
		.then(messages => {
			res.render('user/inbox', { messages: messages, myID: myID })
		})
		.catch(error => console.log("Error showing messages => ", error))
}

module.exports.showOutbox = (req, res, next) => {

	const myID = req.currentUser._id
	PrivateMessage.find({ myUser: myID })
		.populate('myUser')
		.populate('destinationUser')
		.then(messages => {
			res.render('user/inbox', { messages: messages, myID: myID })
		})
		.catch(error => console.log("Error showing messages => ", error))
}

module.exports.showMessage = (req, res, next) => {

	const messageID = req.params.messageID
	const myID = req.currentUser._id
	PrivateMessage.findByIdAndUpdate(messageID, { msgState: "read" })
		.populate('myUser')
		.populate('destinationUser')
		.then(message => {
			res.render('user/message', { message: message, myID: myID })
		})
		.catch(error => console.log("Error showing messages => ", error))
}

module.exports.deleteMessage = (req, res, next) => {

	const messageID = req.params.messageID
	const myID = req.currentUser._id
	PrivateMessage.findByIdAndDelete(messageID)
		.populate('myUser')
		.populate('destinationUser')
		.then(message => {
			res.redirect('back')
		})
		.catch(error => console.log("Error showing messages => ", error))
}

module.exports.sendAnswer = (req, res, next) => {

	const myUser = req.currentUser._id
	const destinationUser = req.params.destinationUserID

	const newMessage = new PrivateMessage({
		myUser: myUser,
		destinationUser: destinationUser,
		subject: req.body.subject,
		body: req.body.body,
		state: "pending"
	})

	newMessage.save()
		.then(message => {
			res.redirect(`/users/${myUser}/inbox`)
		})
		.catch(error => console.log("Error sending message => ", error))
}