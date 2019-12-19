const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views/partials'));

hbs.registerHelper('date', (date) => {
  const format = (s) => (s < 10) ? '0' + s : s
  var d = new Date(date)
  return [format(d.getDate()), format(d.getMonth() + 1), d.getFullYear()].join('/')
})

hbs.registerHelper('americanDate', (date, separator = '/') => {
  const format = (s) => (s < 10) ? '0' + s : s
  var d = new Date(date)
  return [d.getFullYear(), format(d.getMonth() + 1), format(d.getDate())].join(separator)
})

hbs.registerHelper('equals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('includes', function (arg1, arg2, options) {
  return arg2.includes(arg1) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('greaterThan', function (arg1, arg2, options) {
  return (arg1 > arg2) ? options.fn(this) : options.inverse(this)
})

hbs.registerHelper('or', function (arg1, arg2, options) {
  return (arg1 || arg2) ? options.fn(this) : options.inverse(this)
})

hbs.registerHelper('isFriend', function (friends, user, options) {
  const bolleanFriend = friends.some(friend => friend.toString() === user.toString())
  return bolleanFriend ? new hbs.SafeString(options.fn(this)) : new hbs.SafeString(options.inverse(this))
})

hbs.registerHelper('isNotFriend', function (friends, user, options) {
  const bolleanFriend = friends.some(friend => friend.toString() === user.toString())
  return bolleanFriend ? new hbs.SafeString(options.inverse(this)) : new hbs.SafeString(options.fn(this))
})

hbs.registerHelper('itsNotMe', function (user, me, options) {
  return user.toString() === me.toString() ? new hbs.SafeString(options.inverse(this)) : new hbs.SafeString(options.fn(this))
})

hbs.registerHelper('messageRead', function (state, options) {
  return state === "read" ? new hbs.SafeString(options.fn(this)) : new hbs.SafeString(options.inverse(this))
})