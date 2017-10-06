const fs = require('fs');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const range = moment.range('2016-01-01', '2016-12-31');

const elements = [
  'oranges',
  'apples',
  'bananas',
  'berries',
  'tomatoes'
 ];

const wstream = fs.createWriteStream('demo.csv');

for (let day of range.by('day')) {
  elements.forEach(el => {
    wstream.write([
      el,
      day.format('YYYY-MM-DD'), parseInt(Math.random() * 10000)
    ].join());

    wstream.write("\n");
  });
}

wstream.end(function () { console.log('done'); });
