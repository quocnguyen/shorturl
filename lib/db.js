'use strict';

const level = require('level')
const path = require('path')
const db = path.resolve(__dirname, '../', process.env.DB)
module.exports = level(db)
