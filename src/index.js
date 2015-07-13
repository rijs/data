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
      var existing = ripple.resources[res.name] || {}
      delete res.headers.listeners
      extend(res.headers)(existing.headers)

      !res.body    && (res.body = [])
      !res.body.on && (res.body = emitterify(res.body))
       res.body.on.change = res.headers.listeners = res.headers.listeners || []
       res.body.on('change.bubble', () => ripple.emit('change', [res], not(is.in(['data']))))

      return res
    }
  }

  return ripple
}

function trickle(ripple){
  return function(res){
    arguments[0] = arguments[0].body
    return header('content-type', 'application/data')(res)
        && ripple.resources[res.name].body.emit('change', to.arr(arguments), not(is.in(['bubble'])))
  }
}

import emitterify from 'utilise/emitterify'
import header from 'utilise/header'
import extend from 'utilise/extend'
import not from 'utilise/not'
import log from 'utilise/log'
import is from 'utilise/is'
import to from 'utilise/to'
log = log('[ri/types/data]')