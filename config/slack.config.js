const passport = require('passport')
const user = require('../models/user.model')
const SlackStrategy = require('passport-slack').Strategy

const doLogin = (accessToken, refreshToken, profile, done) => {
    // to see the structure of the data in received response:
    console.log("Slack account details:", profile);

    User.findOne({ slackID: profile.id })
      .then(user => {
        if (user) {
          done(null, user);
          return;
        }

        User.create({ slackID: profile.id })
          .then(newUser => {
            done(null, newUser);
          })
          .catch(err => done(err)); // closes User.create()
      })
      .catch(err => done(err)); // closes User.findOne()
  }

module.exports.Strategy = new SlackStrategy({
    clientID: process.env.SLACK_ID,
    clientSecret: process.env.SLACK_SECRET,
    callbackURL: process.env.SLACK_CALLBACK
  },
    doLogin()
  )

