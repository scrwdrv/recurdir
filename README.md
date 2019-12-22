# recurdir

recurdir is a lightweight package written in typescript that allows you to make/remove directories easily.

## Installation

```sh
npm i recurdir 
```

## Usage

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
