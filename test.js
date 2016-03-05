var versioned = require('versioned').default
  , expect = require('chai').expect
  , core = require('rijs.core').default
  , update = require('utilise/update')
  , clone = require('utilise/clone')
  , keys = require('utilise/keys')
  , data = require('./').default
  , key = require('utilise/key')
  , to = require('utilise/to')

describe('Data Type', function() {

  it('should create data resource', function(){  
    var ripple = data(core())
    ripple('foo', { foo: 'bar' })
    expect(ripple('foo')).to.eql({ foo: 'bar' })
  })

  it('should create data resource if no body', function(){  
    var ripple = data(core())
    ripple('foo')
    expect(ripple('foo')).to.eql([])
  })

  it('should not create data resource', function(){  
    var ripple = data(core())
    ripple('baz', String)
    expect(ripple.resources['baz']).to.not.be.ok
  })

  it('should emit local change events', function(){
    var ripple = data(core())
      , fn = function(){ result = to.arr(arguments) }
      , result 

    ripple('foo').on('change', fn)

    ripple('foo').emit('change')
    expect(result).to.eql([null])

    ripple('foo').emit('change', { change: 'yep' })
    expect(result).to.eql([{ change: 'yep' }])
  })

  it('should emit global change events', function(){
    var ripple = data(core())
      , fn = function(){ result = to.arr(arguments) }
      , result 

    ripple('foo')
    ripple.on('change', fn)

    ripple('foo').emit('change')
    expect(result).to.eql(['foo', null])

    ripple('foo').emit('change', { change: 'yep' })
    expect(result).to.eql(['foo', { change: 'yep' }])
  })

  it('should proxy global change events to local', function(){
    var ripple = data(core())
      , fn = function(){ result = to.arr(arguments) }
      , result 

    ripple('foo').on('change', fn)

    ripple.emit('change', 'foo')
    expect(result).to.eql([null])

    ripple.emit('change', ['foo'])
    expect(result).to.eql([null])

    ripple.emit('change', ['foo', false])
    expect(result).to.eql([null])

    ripple.emit('change', ['foo', { change: 'yep' }])
    expect(result).to.eql([{ change: 'yep' }])
  })

  it('should not duplicate listeners', function(){
    var ripple = data(core())
      
    ripple('foo', [1])
    ripple('foo', [2])
    
    expect(ripple.resources.foo.body.on.change.length).to.equal(0)
    expect(ripple.resources.foo.body.on.change.bubble).to.be.a('function')
  })

  it('should not destroy existing headers by default', function(){
    var ripple = data(core())
    
    ripple({ name: 'name', body: ['foo'], headers: { foo: 'bar' }})
    expect(ripple.resources.name.headers.foo).to.be.eql('bar')

    ripple({ name: 'name', body: ['bar'] })
    expect(ripple.resources.name.headers.foo).to.be.eql('bar')

    ripple({ name: 'name', body: ['lorem'], headers: {} })
    expect(ripple.resources.name.headers.foo).to.be.eql('bar')

    ripple({ name: 'name', body: ['baz'], headers: { foo: 'baz'  } })
    expect(ripple.resources.name.headers.foo).to.be.eql('baz')
  })

  it('should not lose all listeners', function(){
    var ripple = data(core())
      
    ripple('foo', ['foo'])
      .on('change', String)
      .on('change.foo', Date)
      .on('foo', Function)
      .on('foo.bar', Boolean)

    ripple('foo', ['bar'])

    expect(ripple('foo').on('change')[0]).to.eql(String)
    expect(ripple('foo').on('change').length).to.eql(1)
    expect(ripple('foo').on('change.foo')).to.eql(Date)
    
    expect(ripple('foo').on('foo')[0]).to.eql(Function)
    expect(ripple('foo').on('foo').length).to.eql(1)
    expect(ripple('foo').on('foo.bar')).to.eql(Boolean)
  })

  it('should not lose log and update it on overwrite', function(){
    var ripple = data(core())
      , changes = []

    ripple.on('change', function(d, change){ changes.push(clone(change)) })

    ripple('foo', versioned(['foo']))
    update(0, 'bar')(ripple('foo'))
    
    // should not need to explicity reinit version
    ripple('foo', ['baz'])
    update(0, 'boo')(ripple('foo'))
    expect(keys(ripple('foo'))).to.eql(['0'])

    // should work if new object versioned
    ripple('foo', versioned(['wat']))
    expect(keys(ripple('foo'))).to.eql(['0'])

    expect(ripple('foo').log.length).to.eql(5)
    expect(ripple('foo').log[0].value.toJS()).to.eql(['foo'])
    expect(ripple('foo').log[0].diff).to.eql(undefined)
    
    expect(ripple('foo').log[1].value.toJS()).to.eql(['bar'])
    expect(ripple('foo').log[1].diff).to.eql({ key: '0', value: 'bar', type: 'update' })
    
    expect(ripple('foo').log[2].value.toJS()).to.eql(['baz'])
    expect(ripple('foo').log[2].diff).to.eql(undefined)

    expect(ripple('foo').log[3].value.toJS()).to.eql(['boo'])
    expect(ripple('foo').log[3].diff).to.eql({ key: '0', value: 'boo', type: 'update' })

    expect(ripple('foo').log[4].value.toJS()).to.eql(['wat'])
    expect(ripple('foo').log[4].diff).to.eql(undefined)

    expect(changes).to.eql([ 
      { type: 'update', value: ['foo'] }
    , { type: 'update', value:  'bar', key: '0' }
    , { type: 'update', value: ['baz'] }
    , { type: 'update', value:  'boo', key: '0' }
    , { type: 'update', value: ['wat'] }
    ])
  })

})