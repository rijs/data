var expect = require('chai').expect
  , core = require('rijs.core').default
  , data = require('./').default
  , core = require('rijs.core').default
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
    expect(result).to.eql([-1])

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
    expect(result).to.eql(['foo', -1])

    ripple('foo').emit('change', { change: 'yep' })
    expect(result).to.eql(['foo', { change: 'yep' }])
  })

  it('should proxy global change events to local', function(){
    var ripple = data(core())
      , fn = function(){ result = to.arr(arguments) }
      , result 

    ripple('foo').on('change', fn)

    ripple.emit('change', 'foo')
    expect(result).to.eql([-1])

    ripple.emit('change', ['foo'])
    expect(result).to.eql([-1])

    ripple.emit('change', ['foo', false])
    expect(result).to.eql([-1])

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


})