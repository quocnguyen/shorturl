/*!
 * shorturl
 * Copyright(c) 2016-2016 quocnguyen <quocnguyen@clgt.vn>
 */

'use strict';

const http = require('http');
const Router = require('router');
const finalhandler = require('finalhandler');
const middleware = require('./middleware');
const shortid = require('shortid');
const db = require('./db');
const bus = require('./bus');

const app = new Router();
middleware(app);

app.get('/', (req, res) => {
  res.render('home.html');
});

app.post('/', (req, res) => {
  if ( ! req.body.url) {
    res.statusCode = 400;
    return res.render('home.html', {
      err: 'url missing',
    });
  }

  let id = shortid.generate();
  db.put(id, req.body.url);
  res.render('home.html', {
    shorturl: process.env.DOMAIN + '/' + id,
  });
  bus.emit('generated', req.body.url, id);
});

app.get('/:id', (req, res) => {
  db.get(req.params.id, (err, url) => {
    if (err) {
      res.statusCode = 404;
      return res.end('not found');
    }
    res.setHeader('Location', url);
    res.statusCode = 301;
    res.end();
  });
});


module.exports = http.createServer((req, res) => {
  app(req, res, finalhandler(req, res));
});