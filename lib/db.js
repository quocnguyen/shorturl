'use strict'

const level = require('level')
const path = require('path')
const ttl = require('level-ttl')
const db = path.resolve(__dirname, '../', process.env.DB)
module.exports = ttl(level(db))
