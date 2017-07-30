'use strict';

// -------------------------------------------
// Adds support for data resources
// -------------------------------------------
module.exports = function data(ripple) {
  log('creating');
  ripple.on('change.data', trickle(ripple));
  ripple.types['application/data'] = {
    header: 'application/data',
    check: function check(res) {
      return is.obj(res.body) ? true : false;
    },
    to: function to(res) {
      return is.fn(res.value) && (res.value = str(res.value)), res;
    },
    parse: function parse(res) {
      if (is.str(res.body)) res.body = fn(res.body);
      var existing = ripple.resources[res.name] || {};

      extend(res.headers)(existing.headers);
      res.body = set()(res.body || [], existing.body && existing.body.log, is.num(res.headers.log) ? res.headers.log : -1);
      overwrite(res.body.on)(listeners(existing));
      res.body.on('change.bubble', function (change) {
        ripple.emit('change', ripple.change = [res.name, change], not(is.in(['data'])));
        delete ripple.change;
      });

      return res;
    }
  };

  return ripple;
};

var trickle = function trickle(ripple) {
  return function (name, change) {
    return header('content-type', 'application/data')(ripple.resources[name]) && ripple.resources[name].body.emit('change', [change || null], not(is.in(['bubble'])));
  };
};

var overwrite = require('utilise/overwrite'),
    header = require('utilise/header'),
    extend = require('utilise/extend'),
    not = require('utilise/not'),
    key = require('utilise/key'),
    set = require('utilise/set'),
    fn = require('utilise/fn'),
    is = require('utilise/is'),
    log = require('utilise/log')('[ri/types/data]'),
    listeners = key('body.on');