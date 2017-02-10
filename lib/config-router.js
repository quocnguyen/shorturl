'use strict'

const consolidate = require('consolidate')
const url = require('url')
const qs = require('querystring')
const helmet = require('helmet')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')
const path = require('path')
const bodyParser = require('body-parser')

module.exports = function (app) {
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  // res.render
  app.use((req, res, next) => {
    res.render = (file, locals) => {
      let filepath = path.resolve(__dirname, '../views/', file)
      locals = Object.assign(locals || {}, res.locals || {})
      consolidate.mustache(filepath, locals, (err, html) => {
        if (err) { return next(err) }
        res.setHeader('Content-Type', 'text/html charset=utf8')
        res.end(html)
      })
    }
    next()
  })

  // parse querystring
  app.use(
    (req, res, next) => {
      req.query = qs.parse(
        url.parse(req.url).query
      )
      next()
    }
  )

  app.use(helmet())

  app.use(cookieParser())

  // csrf protection
  if (process.env.NODE_ENV !== 'test') {
    app.use(csurf({
      cookie: true
    }))
    app.use((req, res, next) => {
      res.locals = res.locals || {}
      res.locals.csrfToken = req.csrfToken()
      next()
    })
  }

  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.statusCode = 500
    res.end('bad csrf')
  })

  // res.json
  app.use((req, res, next) => {
    res.json = (obj) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf8')
      res.end(JSON.stringify(obj, null, 4))
    }
    next()
  })

  return app
}
