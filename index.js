/*!
 * shorturl
 * Copyright(c) 2016-2016 quocnguyen <quocnguyen@clgt.vn>
 */

'use strict';

const path = require('path');

// load .env file into process.env only if exists
require('dotenv').config({
  silent: true,
  path: path.resolve(__dirname, '.env')
});

// register hook before app start
require('./lib/hook');

// app wise event bus
const bus = require('./lib/bus');

// main app
var app = require('./lib/app');

// kick off
app.listen(
  process.env.PORT,
  () => bus.emit('app start'));
