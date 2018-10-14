# mt940-js
[![Build Status](https://travis-ci.org/webschik/mt940-js.svg?branch=master)](https://travis-ci.org/webschik/mt940-js)
[![npm](https://img.shields.io/npm/dm/mt940-js.svg)](https://www.npmjs.com/package/mt940-js)
[![npm](https://img.shields.io/npm/v/mt940-js.svg)](https://www.npmjs.com/package/mt940-js)
[![npm](https://img.shields.io/npm/l/mt940-js.svg)](https://www.npmjs.com/package/mt940-js)
[![Coverage Status](https://coveralls.io/repos/github/webschik/mt940-js/badge.svg?branch=master)](https://coveralls.io/github/webschik/mt940-js?branch=master)

> An isomorphic Javascript library for working with [MT940](#related-links) format

# [Changelog](CHANGELOG.md)

## Reading
### API
#### read(buffer, options)
* `buffer` {Buffer|ArrayBuffer} - income buffer that contains data of mt940 file.
* `options` {ReadOptions}
* returns `Promise` with list of [Statement](src/index.ts#L49).

##### ReadOptions
* `getTransactionId(transaction, index)` - a custom generator for transaction id. By default it's:
```js
/**
* @description version 0.5.x
* @param {Transaction} transaction
* @param {number} index
* @returns {string}
*/
function getTransactionId (transaction, index) {
    return md5(`${ date }${ transaction.description }${ amount }${ transaction.currency }`);
}


/**
* @description version 0.6.x+
* @param {Transaction} transaction
* @param {number} index
* @returns {string}
*/
function getTransactionId (transaction, index) {
    return md5(JSON.strinfigy(transaction));
}
```

### Node.js environment
````js
import * as mt940 from 'mt940-js';
import fs from 'fs';

fs.readFile('/path/to/your/mt940/file', (error, buffer) => {
    mt940.read(buffer).then((statements) => {
        //
    });
});
````

### Browser environment
#### Reading a local file
````html
<input type="file" onchange="onFileSelected(this.files[0])"/>
````
````js
import * as mt940 from 'mt940-js';

function onFileSelected (file) {
    const reader = new FileReader();
    
    reader.onload = () => {
        mt940.read(reader.result).then((statements) => {
            // List of the Statements
        });
    };
    reader.readAsArrayBuffer(file);
}
````
#### Reading a remote file
````js
import * as mt940 from 'mt940-js';

fetch('/url/to/mt940/file')
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
        mt940.read(buffer).then((statements) => {
            // List of the Statements
        });
    });
````

## Writing
Coming soon

## Supported MT940 tags
* **:20:**
* **:21:**
* **:25:**
* **:28(C):**
* **:60(M|F):**
* **:61:**
* **:62(M|F):**
* **:64:**
* **:65:**
* **:86:**

## Related links
### JS
* [Buffer](https://nodejs.org/api/buffer.html)
* [ArrayBuffer](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### mt940 specification
* [Societe Generale spec.](https://web.archive.org/web/20160725042101/http://www.societegenerale.rs/fileadmin/template/main/pdf/SGS%20MT940.pdf)
* [Sepa spec.](http://www.sepaforcorporates.com/swift-for-corporates/account-statement-mt940-file-format-overview/)
* [Deutsche Bank spec.](https://deutschebank.nl/nl/docs/MT94042_EN.pdf)
