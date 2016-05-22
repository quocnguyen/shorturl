'use strict';

const level = require('level');
const path = require('path');
module.exports = level(path.resolve(__dirname, '../', process.env.DB));