'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = data;

var _emitterify = require('utilise/emitterify');

var _emitterify2 = _interopRequireDefault(_emitterify);

var _header = require('utilise/header');

var _header2 = _interopRequireDefault(_header);

var _extend = require('utilise/extend');

var _extend2 = _interopRequireDefault(_extend);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _to = require('utilise/to');

var _to2 = _interopRequireDefault(_to);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Adds support for data resources
// -------------------------------------------
function data(ripple) {
  log('creating');
  ripple.on('change.data', trickle(ripple));
  ripple.types['application/data'] = {
    header: 'application/data',
    check: function check(res) {
      return _is2.default.obj(res.body) || !res.body ? true : false;
    },
    parse: function parse(res) {
      var existing = ripple.resources[res.name] || {};
      delete res.headers.listeners;
      (0, _extend2.default)(res.headers)(existing.headers);

      !res.body && (res.body = []);
      !res.body.on && (res.body = (0, _emitterify2.default)(res.body, -1));
      res.body.on.change = res.headers.listeners = res.headers.listeners || [];
      res.body.on('change.bubble', function (change) {
        return ripple.emit('change', [res.name, change], (0, _not2.default)(_is2.default.in(['data'])));
      });

      return res;
    }
  };

  return ripple;
}

var trickle = function trickle(ripple) {
  return function (name, change) {
    return (0, _header2.default)('content-type', 'application/data')(ripple.resources[name]) && ripple.resources[name].body.emit('change', [change || -1], (0, _not2.default)(_is2.default.in(['bubble'])));
  };
};

var log = require('utilise/log')('[ri/types/data]');