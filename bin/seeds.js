require('../config/db.config')

const User = require('../models/user.model')
const faker = require('faker')

let userIds = []


    for (let i = 0; i < 100; i++) {
        const user = new User({
            name: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            nickName: faker.internet.userName(),
            password: '123123123',
            avatar: faker.image.avatar(),
            bio: faker.lorem.sentence(),
            validated: true,
            rol: 'User',
            createdAt: faker.date.past()
          })
    
          user.save()
            .then(user => {
              console.log(user.nickName)
              userIds.push(user._id)
            })
            .catch(error => console.error(error))
    }