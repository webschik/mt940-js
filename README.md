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

* `input` {Buffer|ArrayBuffer} - input buffer that contains data of mt940 file.
* `options` {ReadOptions}
* returns list of [Statement](src/index.ts#L48).
*

#### readAsync(buffer, options)

* `input` {Readable} - a stream of data, e.g. created from fs.createReadStream
* `options` {Options}
* returns Readable, emitting [Statement](src/index.ts#L48).

##### Options

* `statementSplitSequence` - only used in the readAsync method, splits the incoming stream based on this char sequence, processing each chunk synchronously. Default is `:20:`
* `getTransactionId(transaction, index)` - a custom generator for transaction id. By default it's:

```js
function getTransactionId(transaction, index) {
    return md5(JSON.strinfigy(transaction));
}
```

### Node.js environment

````js
import * as mt940 from 'mt940-js';
import fs from 'fs';

const stream = mt940.readStream(fs.createReadStream("mt940.sta"))
stream.on("data", (statement: Statement) => console.log(statement))
stream.on("error", e => console.error(e))
stream.on("end", () => console.log("finished parsing"))

// or 

const stream = mt940.readStream(fs.createReadStream("mt940.sta", {encoding: "utf-8"}))
for await (const statement of stream) {
    console.log(statement)
}
````

### Browser environment

#### Reading a local file

````html
<input type="file" onchange="onFileSelected(this.files[0])"/>
````

````js
import * as mt940 from 'mt940-js';

function onFileSelected(file) {
    const reader = new FileReader();

    reader.onload = () => {
        const statements = mt940.read(reader.result)
        console.log(statements)
    };
    reader.readAsArrayBuffer(file);
}
````

#### Reading a remote file

````js
import * as mt940 from 'mt940-js';

fetch('/url/to/mt940/file')
    .then((response) => response.arrayBuffer())
    .then((buffer) => mt940.read(buffer))
    .then((statements) => /* a list of the Statements */)
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

* [Readable](https://nodejs.org/api/stream.html)
* [Buffer](https://nodejs.org/api/buffer.html)
* [ArrayBuffer](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### mt940 specification

* [Societe Generale spec.](https://web.archive.org/web/20160725042101/http://www.societegenerale.rs/fileadmin/template/main/pdf/SGS%20MT940.pdf)
* [Sepa spec.](http://www.sepaforcorporates.com/swift-for-corporates/account-statement-mt940-file-format-overview/)
* [Deutsche Bank spec.](https://deutschebank.nl/nl/docs/MT94042_EN.pdf)
