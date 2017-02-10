'use strict'

require('dotenv').config({ silent: true })
process.env.NODE_ENV = 'test'
const test = require('ava')
const supertest = require('supertest')
const app = require('./lib/app')

test.cb('post', t => {
  supertest(app)
    .post('/batch')
    .send({
      urls: [
        'https://dwdqwdqw.com'
      ]
    })
    .end((err, res) => {
      t.is(err, null)
      t.is(res.body.status, 'OK')
      t.end()
    })
})

