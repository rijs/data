# Ripple | Data
[![Coverage Status](https://coveralls.io/repos/rijs/data/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/data?branch=master)
[![Build Status](https://travis-ci.org/rijs/data.svg)](https://travis-ci.org/rijs/data)

Allows registering data resources (objects or arrays).

```js
ripple('data', [])
```

All data resources will be emitterified:

```js
ripple('data').on('change', fn)
ripple('data').once('change', fn)
ripple('data').emit('change')
```