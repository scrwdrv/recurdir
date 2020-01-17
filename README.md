# recurdir

recurdir is a lightweight package written in typescript that allows you to make/remove directories easily.

## Installation

```sh
npm i recurdir 
```

## Usage

### rm/mk dir
```js
import * as recurdir from 'recurdir';
//or const recurdir = require('recurdir');

//make directory
recurdir.mk('./path/to/dir', (err) => {
    if (err) console.log(err)
    else console.log('done')
});

//remove multiple directories
recurdir.rm(['./path/to/dir', './path/to/dir2'], (err) => {
    if (err) console.log(err)
    else console.log('done')
});

//make multiple directories with promise
recurdir.mk(['./path/to/dir', './path/to/dir2']).then(() => {
    console.log('done!')
}).catch((err) => {
    console.log(err)
});
```
### stats
```js
recurdir.stats('./node_modules', (err, stats) => {
    if (err) return console.log(err);
    console.log(stats);
    /* output:
    {
      '@types': {
          node: {
            'zlib.d.ts': [Stats],
            'worker_threads.d.ts': [Stats],
            'vm.d.ts': [Stats],
            'v8.d.ts': [Stats],      
            .
            .
            .
            'assert.d.ts': [Stats],
            'ts3.2': [Object]
          }
       }
    }
    */
});
```

#### With Formatter
```js
recurdir.stats('./node_modules', (err, stats) => {
    if (err) return console.log(err);
    console.log(stats);
    /* output:
    {
      '@types': {
          node: {
            'worker_threads.d.ts': 7325,
            'zlib.d.ts': 12182,
            'vm.d.ts': 4542,
            'v8.d.ts': 6927,
            .
            .
            .
            'assert.d.ts': 2660,
            'ts3.2': [Object]
          }
       }
    }
    */
}, (stats) => {
    return stats.size;
});
```