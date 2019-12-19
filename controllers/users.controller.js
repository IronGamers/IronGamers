const User = require('../models/user.model')
const ChatGames = require('../models/chatRoom-model')
const Messages = require('../models/chat-model')
const Friend = require('../models/friend-model')
const mongoose = require('mongoose')
const PrivateMessage = require('../models/private-message-model')
const functions = require('../config/functions.api')

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
	.catch(error => next(error))
}

module.exports.editUser = (req, res, next) => {
	const nickName = req.params.nickName
	User.findOne({nickName: nickName})
	.then(user => {
		res.render('user/editUser', {user, aside: 'edit'})
	})
	.catch(error => next(error))
}


// pendiente conseguir los datos del cover modificar ya esta obsoleta
module.exports.chatsRooms = (req, res, next) => {

	res.redirect('/')
	// const nickName = req.params.nickName
	// User.findOne({nickName: nickName})
	// .then(user => {
	// 	let chatRoom = []
	// 	ChatGames.find({users: user.id})
	// 	.then(chats => {
	// 		chats.map(chat => {
	// 			functions.getGameList(chat.game)
	// 			.then(data => {
	// 				const chatInfo = {
	// 					cover: data[0].cover,
	// 					game: chat.game,
	// 					users: chat.users.length,
	// 					createdAt: chat.createdAt
	// 				}
	// 				chatRoom.push(chatInfo)
	// 			})
	// 			.then(done => {
	// 				user.chatrooms = chatRoom
	// 				console.log(user.chatrooms)
	// 				res.render('user/chatsUsers', {user, aside: 'chats'})
	// 			})
	// 		})
			
	// 	})
	// })
	
}

module.exports.messages = (req, res, next) => {
	const nickName = req.params.nickName
	User.findOne({nickName: nickName})
	.then(user => {
		Messages.find({ $or : [ { myUser: user._id }, { destinationUser: user._id } ] })
		.then(chats => {
			user.chats = chats
			console.log(chats)
			res.render('user/userMessage', {user, aside: 'messages'})
		})
		.catch(error => next(error))
	})
	.catch(error => next(error))
}

module.exports.friends = (req, res, next) => {
	const nickName = req.params.nickName
	User.findOne({nickName: nickName})
	.then(user => {
		user.friends = []
		Friend.find({ $or : [ { user1: user._id }, { user2: user._id } ] })
		.then(friend => {
			const friends = friend.map(friendship => {
					if(user.id.toString() === friendship.user1.toString()){
					return	User.findById(friendship.user2)
						.then(detail => {
							detail.state = friendship.state
							detail.principalUser = friendship.user1
							user.friends.push(detail)
							return detail
						})
					}else{
						return	User.findById(friendship.user1)
						.then(detail => {
							detail.state = friendship.state
							detail.principalUser = friendship.user1
							user.friends.push(detail)
							return detail
						})
					}
				})
				console.log(friends)
				res.render('user/userFriends', {user, aside: 'friends'})
		})
		.catch(error => next(error))
	})
	.catch(error => next(error))
}

module.exports.create = (req, res, next) => {
	const user = new User({
		name: req.body.name,
		lastname: req.body.lastname,
		nickName: req.body.nickname,
		email: req.body.email,
		password: req.body.password,
		avatar: req.file.url
	})

	if (!user.avatar) {
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

// POSTS 

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
                            res.redirect(`/user/${user.nickName}`)
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

module.exports.doEdit = (req, res, next) => {
	const {name, lastname, nickName, email} = req.body
	
	const newUser = {
		...req.currentUser,
		name: name,
		lastName: lastname,
		email: email,
		nickName: nickName
	}
	console.log(newUser)

	User.findOneAndUpdate({nickName: req.params.nickName}, newUser, {new: true})
	.then(user => {
		console.log(user)
		res.render('user/userDetail', {user})
	})
	.catch(error => next(error))
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
			res.render('user/inbox', { messages: messages.reverse(), myID: myID })
		})
		.catch(error => console.log("Error showing messages => ", error))
}

module.exports.showOutbox = (req, res, next) => {

	const myID = req.currentUser._id
	PrivateMessage.find({ myUser: myID })
		.populate('myUser')
		.populate('destinationUser')
		.then(messages => {
			res.render('user/outbox', { messages: messages.reverse(), myID: myID })
		})
		.catch(error => console.log("Error showing messages => ", error))
}


module.exports.detailMessageInbox = (req, res, next) => {
	const messageID = req.params.messageID
	const myID = req.currentUser._id

	PrivateMessage.findOne({ _id: messageID })
		.populate('myUser')
		.populate('destinationUser')
		.then(message => {
			res.render('user/message', { message: message, myID: myID, type: 'inbox' })
		})
		.catch(error => console.log("Error showing messages => ", error))
}


module.exports.showMessageInbox = (req, res, next) => {

	const messageID = req.params.messageID

	PrivateMessage.findByIdAndUpdate(messageID, { msgState: "read" })
		.then(message => {
			res.json({})
		})
		.catch(error => console.log("Error showing messages => ", error))
}

module.exports.showMessageOutbox = (req, res, next) => {

	const messageID = req.params.messageID
	const myID = req.currentUser._id
	PrivateMessage.findOne({ _id: messageID })
		.populate('myUser')
		.populate('destinationUser')
		.then(message => {
			res.render('user/message', { message: message, myID: myID, type: 'outbox' })
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