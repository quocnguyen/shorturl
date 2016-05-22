'use strict';

const consolidate = require('consolidate');
const qs = require('querystring');

const path = require('path');
module.exports = function(app) {

  // res.render
  app.use((req, res, next) => {
    res.render = (file, locals) => {
      let filepath = path.resolve(__dirname, '../views/', file);
      consolidate.mustache(filepath, locals || {}, (err, html) => {
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
};