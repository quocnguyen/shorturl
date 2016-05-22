/*!
 * dead simple event bus
 * Copyright(c) 2016-2016 quocnguyen <quocnguyen@clgt.vn>
 */

'use strict';
const events = require('events');
module.exports = new events.EventEmitter();