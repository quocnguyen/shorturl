/*!
 * shorturl
 * Copyright(c) 2016-2016 quocnguyen <quocnguyen@clgt.vn>
 */

'use strict'

const http = require('http')
const Router = require('router')
const finalhandler = require('finalhandler')
const configRouter = require('./config-router')
const shortid = require('shortid')
const db = require('./db')
const bus = require('./bus')
const isURL = require('is-absolute-url')

const app = configRouter(new Router())

app.get('/', (req, res) => {
  res.render('home.html')
})

app.get('/api', (req, res) => {
  if (!req.query.url) {
    return res.json({
      status: 'ERR',
      msg: 'url missing'
    })
  }

  let id = shortid.generate()
  db.put(id, req.query.url)

  res.json({
    status: 'OK',
    data: `http://${process.env.VIRTUAL_HOST}/${id}`
  })

  bus.emit('generated', req.body.url, id)
})

// process a bunch of urls
app.post('/batch', (req, res) => {
  req.body.ttl = req.body.ttl || {}
  if (
    !req.body.urls ||
    req.body.urls.length === 0 ||
    isURLGood(req.body.urls) === false
  ) {
    return res.json({
      status: 'ERR',
      msg: 'urls invalid'
    })
  }

  const urls = req.body.urls.map(url => {
    const id = shortid.generate()
    db.put(id, url, req.body.ttl)
    return `http://${process.env.VIRTUAL_HOST}/${id}`
  })

  return res.json({
    status: 'OK',
    data: urls
  })
})

app.post('/', (req, res) => {
  if (!req.body.url) {
    res.statusCode = 400
    return res.render('home.html', {
      err: 'url missing'
    })
  }

  let id = shortid.generate()
  db.put(id, req.body.url)
  res.render('home.html', {
    shorturl: `http://${process.env.VIRTUAL_HOST}/${id}`
  })
  bus.emit('generated', req.body.url, id)
})

app.get('/:id', (req, res) => {
  db.get(req.params.id, (err, url) => {
    if (err) {
      res.statusCode = 404
      return res.end('not found')
    }
    res.setHeader('Location', url)
    res.statusCode = 301
    res.end()
  })
})

// make sure all urls is good one
const isURLGood = (urls) => {
  const good = urls.filter(url => isURL(url))
  return good.length === urls.length
}

module.exports = http.createServer((req, res) => {
  app(req, res, finalhandler(req, res))
})
