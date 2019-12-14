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

