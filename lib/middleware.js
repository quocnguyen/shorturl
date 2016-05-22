'use strict';

const consolidate = require('consolidate');
const qs = require('querystring');
const helmet = require('helmet');
const xtend = require('xtend');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const path = require('path');

module.exports = function(app) {

  // res.render
  app.use((req, res, next) => {
    res.render = (file, locals) => {
      let filepath = path.resolve(__dirname, '../views/', file);
      locals = xtend(locals || {}, res.locals || {});
      consolidate.mustache(filepath, locals, (err, html) => {
        if (err) { return next(err); }
        res.setHeader('Content-Type', 'text/html; charset=utf8');
        res.end(html);
      });
    };
    next();
  });

  app.use((req, res, next) => {
    req.body = {};
    if (req.method !== 'POST') { return next(); }

    let body = '';
    req.on('data', function(buf) {
      body += buf.toString();
    });
    req.on('end', function() {
      req.body = qs.parse(body);
      next();
    });
  });

  app.use(helmet());

  app.use(cookieParser());

  // csrf protection
  if (process.env.NODE_ENV !== 'test') {
    app.use(csurf({
      cookie: true
    }));
    app.use((req, res, next) => {
      res.locals = res.locals || {};
      res.locals.csrfToken = req.csrfToken();
      next();
    });
  }

  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.statusCode = 500;
    res.end('bad csrf');
  });
};