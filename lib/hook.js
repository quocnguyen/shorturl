'use strict';

const bus = require('./bus');
const info = require('debug')('shorturl:info');
const error = require('debug')('shorturl:error');
error.color = 6; // red color

bus.on('app start', () => {
  info('app start on port: %o', process.env.PORT);
});

bus.on('generated', (url, id) => {
  info('%o: %o', url, id);
})
