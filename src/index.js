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
      delete res.headers.listeners
      extend(res.headers)(existing.headers)

      !res.body    && (res.body = [])
      !res.body.on && (res.body = emitterify(res.body, -1))
       res.body.on.change = res.headers.listeners = res.headers.listeners || []
       res.body.on('change.bubble', change => ripple.emit('change', [res.name, change], not(is.in(['data']))))

      return res
    }
  }

  return ripple
}

const trickle = ripple => (name, change) => header('content-type', 'application/data')(ripple.resources[name])
  && ripple
      .resources[name]
      .body
      .emit('change', [change || -1], not(is.in(['bubble'])))

import emitterify from 'utilise/emitterify'
import header from 'utilise/header'
import extend from 'utilise/extend'
import not from 'utilise/not'
import is from 'utilise/is'
import to from 'utilise/to'
const log = require('utilise/log')('[ri/types/data]')