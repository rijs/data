// -------------------------------------------
// Adds support for data resources
// -------------------------------------------
export default function data(ripple){
  log('creating')
  ripple.on('change.data', trickle(ripple))
  ripple.types['application/data'] = {
    header: 'application/data'
  , check(res){ return is.obj(res.body) || !res.body ? true : false }
  , parse(res){ 
      const existing = ripple.resources[res.name] || {}

      !res.body    && (res.body = [])
      !res.body.on && (res.body = emitterify(res.body, null))

      extend(res.headers)(existing.headers)
      overwrite(res.body.on)(existing.body && existing.body.on || {})
      if (logged(existing)) res.body.log = existing.body.log.reset(res.body)

      res.body.on('change.bubble', change => ripple.emit('change', [res.name, change], not(is.in(['data']))))
      res.body.on('log.bubble', change => res.body.emit('change', change))

      return res
    }
  }

  return ripple
}

const trickle = ripple => (name, change) => header('content-type', 'application/data')(ripple.resources[name])
  && ripple
      .resources[name]
      .body
      .emit('change', [change || null], not(is.in(['bubble'])))

import emitterify from 'utilise/emitterify'
import overwrite from 'utilise/overwrite'
import header from 'utilise/header'
import extend from 'utilise/extend'
import not from 'utilise/not'
import key from 'utilise/key'
import is from 'utilise/is'
import to from 'utilise/to'
const log = require('utilise/log')('[ri/types/data]')
    , logged = key('body.log')