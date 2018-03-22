var data = (function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	var is_1 = is;
	is.fn      = isFunction;
	is.str     = isString;
	is.num     = isNumber;
	is.obj     = isObject;
	is.lit     = isLiteral;
	is.bol     = isBoolean;
	is.truthy  = isTruthy;
	is.falsy   = isFalsy;
	is.arr     = isArray;
	is.null    = isNull;
	is.def     = isDef;
	is.in      = isIn;
	is.promise = isPromise;
	is.stream  = isStream;

	function is(v){
	  return function(d){
	    return d == v
	  }
	}

	function isFunction(d) {
	  return typeof d == 'function'
	}

	function isBoolean(d) {
	  return typeof d == 'boolean'
	}

	function isString(d) {
	  return typeof d == 'string'
	}

	function isNumber(d) {
	  return typeof d == 'number'
	}

	function isObject(d) {
	  return typeof d == 'object'
	}

	function isLiteral(d) {
	  return d.constructor == Object
	}

	function isTruthy(d) {
	  return !!d == true
	}

	function isFalsy(d) {
	  return !!d == false
	}

	function isArray(d) {
	  return d instanceof Array
	}

	function isNull(d) {
	  return d === null
	}

	function isDef(d) {
	  return typeof d !== 'undefined'
	}

	function isPromise(d) {
	  return d instanceof Promise
	}

	function isStream(d) {
	  return !!(d && d.next)
	}

	function isIn(set) {
	  return function(d){
	    return !set ? false  
	         : set.indexOf ? ~set.indexOf(d)
	         : d in set
	  }
	}

	var keys = function keys(o) { 
	  return Object.keys(is_1.obj(o) || is_1.fn(o) ? o : {})
	};

	var copy = function copy(from, to){ 
	  return function(d){ 
	    return to[d] = from[d], d
	  }
	};

	var overwrite = function overwrite(to){ 
	  return function(from){
	    keys(from)
	      .map(copy(from, to));
	        
	    return to
	  }
	};

	var wrap = function wrap(d){
	  return function(){
	    return d
	  }
	};

	var str = function str(d){
	  return d === 0 ? '0'
	       : !d ? ''
	       : is_1.fn(d) ? '' + d
	       : is_1.obj(d) ? JSON.stringify(d)
	       : String(d)
	};

	var key = function key(k, v){ 
	  var set = arguments.length > 1
	    , keys$$1 = is_1.fn(k) ? [] : str(k).split('.').filter(Boolean)
	    , root = keys$$1.shift();

	  return function deep(o, i){
	    var masked = {};
	    
	    return !o ? undefined 
	         : !is_1.num(k) && !k ? (set ? replace(o, v) : o)
	         : is_1.arr(k) ? (k.map(copy), masked)
	         : o[k] || !keys$$1.length ? (set ? (o[k] = is_1.fn(v) ? v(o[k], i) : v, o)
	                                       :  (is_1.fn(k) ? k(o) : o[k]))
	                                : (set ? (key(keys$$1.join('.'), v)(o[root] ? o[root] : (o[root] = {})), o)
	                                       :  key(keys$$1.join('.'))(o[root]))

	    function copy(k){
	      var val = key(k)(o);
	      val = is_1.fn(v)       ? v(val) 
	          : val == undefined ? v
	                           : val;
	    if (val != undefined) 
	        { key(k, is_1.fn(val) ? wrap(val) : val)(masked); }
	    }

	    function replace(o, v) {
	      keys(o).map(function(k){ delete o[k]; });
	      keys(v).map(function(k){ o[k] = v[k]; });
	      return o
	    }
	  }
	};

	var header = function header(header$1, value) {
	  var getter = arguments.length == 1;
	  return function(d){ 
	    return !d || !d.headers ? null
	         : getter ? key(header$1)(d.headers)
	                  : key(header$1)(d.headers) == value
	  }
	};

	var not = function not(fn){
	  return function(){
	    return !fn.apply(this, arguments)
	  }
	};

	var extend = function extend(to){ 
	  return function(from){
	    keys(from)
	      .filter(not(is_1.in(to)))
	      .map(copy(from, to));

	    return to
	  }
	};

	var merge_1 = merge;

	function merge(to){ 
	  return function(from){
	    for (x in from) 
	      { is_1.obj(from[x]) && is_1.obj(to[x])
	        ? merge(to[x])(from[x])
	        : (to[x] = from[x]); }
	    return to
	  }
	}

	var attr = function attr(name, value) {
	  var args = arguments.length;
	  
	  return !is_1.str(name) && args == 2 ? attr(arguments[1]).call(this, arguments[0])
	       : !is_1.str(name) && args == 3 ? attr(arguments[1], arguments[2]).call(this, arguments[0])
	       :  function(el){
	            var ctx = this || {};
	            el = ctx.nodeName || is_1.fn(ctx.node) ? ctx : el;
	            el = el.node ? el.node() : el;
	            el = el.host || el;

	            return args > 1 && value === false ? el.removeAttribute(name)
	                 : args > 1                    ? (el.setAttribute(name, value), value)
	                 : el.attributes.getNamedItem(name) 
	                && el.attributes.getNamedItem(name).value
	          } 
	};

	var promise_1 = promise;

	function promise() {
	  var resolve
	    , reject
	    , p = new Promise(function(res, rej){ 
	        resolve = res, reject = rej;
	      });

	  arguments.length && resolve(arguments[0]);
	  p.resolve = resolve;
	  p.reject  = reject;
	  return p
	}

	var flatten = function flatten(p,v){ 
	  if (v instanceof Array) { v = v.reduce(flatten, []); }
	  return p = p || [], p.concat(v) 
	};

	var has = function has(o, k) {
	  return k in o
	};

	var def = function def(o, p, v, w){
	  if (o.host && o.host.nodeName) { o = o.host; }
	  if (p.name) { v = p, p = p.name; }
	  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w });
	  return o[p]
	};

	var noop = function(){};

	var emitterify = function emitterify(body, hooks) {
	  body = body || {};
	  hooks = hooks || {};
	  def(body, 'emit', emit, 1);
	  def(body, 'once', once, 1);
	  def(body, 'off', off, 1);
	  def(body, 'on', on, 1);
	  body.on['*'] = body.on['*'] || [];
	  return body

	  function emit(type, pm, filter) {
	    var li = body.on[type.split('.')[0]] || []
	      , results = [];

	    for (var i = 0; i < li.length; i++)
	      { if (!li[i].ns || !filter || filter(li[i].ns))
	        { results.push(call(li[i].isOnce ? li.splice(i--, 1)[0] : li[i], pm)); } }

	    for (var i = 0; i < body.on['*'].length; i++)
	      { results.push(call(body.on['*'][i], [type, pm])); }

	    return results.reduce(flatten, [])
	  }

	  function call(cb, pm){
	    return cb.next             ? cb.next(pm) 
	         : pm instanceof Array ? cb.apply(body, pm) 
	                               : cb.call(body, pm) 
	  }

	  function on(type, opts, isOnce) {
	    var id = type.split('.')[0]
	      , ns = type.split('.')[1]
	      , li = body.on[id] = body.on[id] || []
	      , cb = typeof opts == 'function' ? opts : 0;

	    return !cb &&  ns ? (cb = body.on[id]['$'+ns]) ? cb : push(observable(body, opts))
	         : !cb && !ns ? push(observable(body, opts))
	         :  cb &&  ns ? push((remove(li, body.on[id]['$'+ns] || -1), cb))
	         :  cb && !ns ? push(cb)
	                      : false

	    function push(cb){
	      cb.isOnce = isOnce;
	      cb.type = id;
	      if (ns) { body.on[id]['$'+(cb.ns = ns)] = cb; }
	      li.push(cb)
	      ;(hooks.on || noop)(cb);
	      return cb.next ? cb : body
	    }
	  }

	  function once(type, callback){
	    return body.on(type, callback, true)
	  }

	  function remove(li, cb) {
	    var i = li.length;
	    while (~--i) 
	      { if (cb == li[i] || cb == li[i].fn || !cb)
	        { (hooks.off || noop)(li.splice(i, 1)[0]); } }
	  }

	  function off(type, cb) {
	    remove((body.on[type] || []), cb);
	    if (cb && cb.ns) { delete body.on[type]['$'+cb.ns]; }
	    return body
	  }

	  function observable(parent, opts) {
	    opts = opts || {};
	    var o = emitterify(opts.base || promise_1());
	    o.i = 0;
	    o.li = [];
	    o.fn = opts.fn;
	    o.parent = parent;
	    o.source = opts.fn ? o.parent.source : o;
	    
	    o.on('stop', function(reason){
	      o.type
	        ? o.parent.off(o.type, o)
	        : o.parent.off(o);
	      return o.reason = reason
	    });

	    o.each = function(fn) {
	      var n = fn.next ? fn : observable(o, { fn: fn });
	      o.li.push(n);
	      return n
	    };

	    o.pipe = function(fn) {
	      return fn(o)
	    };

	    o.map = function(fn){
	      return o.each(function(d, i, n){ return n.next(fn(d, i, n)) })
	    };

	    o.filter = function(fn){
	      return o.each(function(d, i, n){ return fn(d, i, n) && n.next(d) })
	    };

	    o.reduce = function(fn, acc) {
	      return o.each(function(d, i, n){ return n.next(acc = fn(acc, d, i, n)) })
	    };

	    o.unpromise = function(){ 
	      var n = observable(o, { base: {}, fn: function(d){ return n.next(d) } });
	      o.li.push(n);
	      return n
	    };

	    o.next = function(value) {
	      o.resolve && o.resolve(value);
	      return o.li.length 
	           ? o.li.map(function(n){ return n.fn(value, n.i++, n) })
	           : value
	    };

	    o.until = function(stop){
	      (stop.each || stop.then).call(stop, function(reason){ return o.source.emit('stop', reason) });
	      return o
	    };

	    o.off = function(fn){
	      return remove(o.li, fn), o
	    };

	    o.start = function(fn){
	      o.source.emit('start');
	      return o
	    };

	    o[Symbol.asyncIterator] = function(){ 
	      return { 
	        next: function(){ 
	          return o.wait = new Promise(function(resolve){
	            o.wait = true;
	            o.map(function(d, i, n){
	              delete o.wait;
	              o.off(n);
	              resolve({ value: d, done: false });
	            });
	            o.emit('pull', o);
	          })
	        }
	      }
	    };

	    return o
	  }
	};

	var act = { add: add, update: update, remove: remove }
	  , str$1 = JSON.stringify
	  , parse = JSON.parse;

	var set = function set(d, skipEmit) {
	  return function(o, existing, max) {
	    if (!is_1.obj(o) && !is_1.fn(o))
	      { return o }

	    if (!is_1.obj(d)) { 
	      var log = existing || o.log || []
	        , root = o;

	      if (!is_1.def(max)) { max = log.max || 0; }
	      if (!max)    { log = []; }
	      if (max < 0) { log = log.concat(null); }
	      if (max > 0) {
	        var s = str$1(o);
	        root = parse(s); 
	        log = log.concat({ type: 'update', value: parse(s), time: log.length });
	      } 

	      def(log, 'max', max);
	      
	      root.log 
	        ? (root.log = log)
	        : def(emitterify(root, null), 'log', log, 1);

	      return root
	    }

	    if (is_1.def(d.key)) {
	      if (!apply(o, d.type, (d.key = '' + d.key).split('.').filter(Boolean), d.value))
	        { return false }
	    } else
	      { return false }

	    if (o.log && o.log.max) 
	      { o.log.push((d.time = o.log.length, o.log.max > 0 ? d : null)); }

	    if (!skipEmit && o.emit)
	      { o.emit('change', d); }

	    return o
	  }
	};

	function apply(body, type, path, value) {
	  var next = path.shift();

	  if (!act[type]) 
	    { return false }
	  if (path.length) { 
	    if (!(next in body)) 
	      { if (type == 'remove') { return true }
	      else { body[next] = {}; } }
	    return apply(body[next], type, path, value)
	  }
	  else {
	    return !act[type](body, next, value)
	  }
	}

	function add(o, k, v) {
	  is_1.arr(o) 
	    ? o.splice(k, 0, v) 
	    : (o[k] = v);
	}

	function update(o, k, v) {
	  if (!is_1.num(k) && !k) {
	    if (!is_1.obj(v)) { return true }
	    for (var x in o) { delete o[x]; }
	    for (var x in v) { o[x] = v[x]; }
	  } else 
	    { o[k] = v; } 
	}

	function remove(o, k, v) { 
	  is_1.arr(o) 
	    ? o.splice(k, 1)
	    : delete o[k];
	}

	var to = { 
	  arr: toArray
	, obj: toObject
	};

	function toArray(d){
	  return Array.prototype.slice.call(d, 0)
	}

	function toObject(d) {
	  var by = 'id'
	    ;

	  return arguments.length == 1 
	    ? (by = d, reduce)
	    : reduce.apply(this, arguments)

	  function reduce(p,v,i){
	    if (i === 0) { p = {}; }
	    p[is_1.fn(by) ? by(v, i) : v[by]] = v;
	    return p
	  }
	}

	var client = typeof window != 'undefined';

	var owner = client ? /* istanbul ignore next */ window : commonjsGlobal;

	var log = function log(ns){
	  return function(d){
	    if (!owner.console || !console.log.apply) { return d; }
	    is_1.arr(arguments[2]) && (arguments[2] = arguments[2].length);
	    var args = to.arr(arguments)
	      , prefix = '[log][' + (new Date()).toISOString() + ']' + ns;

	    args.unshift(prefix.grey ? prefix.grey : prefix);
	    return console.log.apply(console, args), d
	  }
	};

	// -------------------------------------------
	// Adds support for data resources
	// -------------------------------------------
	var data = function data(ripple){
	  log$1('creating');
	  ripple
	    .on('change.data')
	    .filter(function (ref) {
	      var name = ref[0];
	      var change = ref[1];

	      return header('content-type', 'application/data')(ripple.resources[name]);
	  })
	    .filter(function (ref) {
	      var name = ref[0];
	      var change = ref[1];

	      return change && change.key;
	  })
	    .map(function (ref) {
	      var name = ref[0];
	      var change = ref[1];

	      return ripple
	      .resources[name]
	      .body
	      .emit('change', (change || null), not(is_1.in(['bubble'])));
	  });

	  ripple.types['application/data'] = {
	    header: 'application/data'
	  , ext: '*.data.js'
	  , selector: function (res) { return ("[data~=\"" + (res.name) + "\"]"); }
	  , extract: function (el) { return (attr("data")(el) || '').split(' '); }
	  , check: function (res) { return is_1.obj(res.body); }
	  , load: function load(res) {
	      var exported = commonjsRequire(res.headers.path);
	      exported = exported.default || exported;
	      exported = is_1.fn(exported) ? exported(ripple) : exported;
	      res.headers['content-type'] = this.header;
	      ripple(merge_1(res)(exported));
	      return ripple.resources[res.name]
	    }
	  , parse: function parse(res){ 
	      var existing = ripple.resources[res.name] || {};

	      extend(res.headers)(existing.headers);
	      res.body = set()(
	        res.body || []
	      , existing.body && existing.body.log
	      , is_1.num(res.headers.log) ? res.headers.log : -1
	      );
	      overwrite(res.body.on)(listeners(existing));
	      res.body.on('change.bubble', function (change) {
	        ripple.emit('change', ripple.change = [res.name, change], not(is_1.in(['data'])));
	        delete ripple.change;
	      });

	      if (res.headers.loaded && !res.headers.loading)
	        { res.headers.loading = Promise.resolve(res.headers.loaded(ripple, res))
	          .then(function () { 
	            delete res.headers.loading;
	            return res
	          }); }

	      return res
	    }
	  };

	  return ripple
	};

	var log$1 = log('[ri/types/data]')
	    , listeners = key('body.on');

	return data;

}());
