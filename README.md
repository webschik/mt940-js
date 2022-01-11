# mt940-js

> An isomorphic Javascript library for working with [MT940](#related-links) format

# [Changelog](CHANGELOG.md)

## Reading

### API

#### read(buffer, options)

* `input` {Buffer|ArrayBuffer} - input buffer that contains data of mt940 file.
* `options` {ReadOptions}
* returns list of [Statement](src/index.ts#L50).
*

#### readAsync(buffer, options)

* `input` {Readable} - a stream of data, e.g. created from fs.createReadStream
* `options` {ReadOptions}
* returns Readable, emitting [Statement](src/index.ts#L50).

##### ReadOptions

* `getTransactionId(transaction, index)` - a custom generator for transaction id. By default it's:

```js
function getTransactionId(transaction, index) {
    return md5(JSON.strinfigy(transaction));
}
```

### Node.js environment

````js
import * as mt940 from '@jewell-lgtm/mt940-js';
import fs from 'fs';

const stream = mt940.readStream(fs.createReadStream("mt940.sta"))
stream.on("data", (statement: Statement) => console.log(statement))
stream.on("error", e => console.error(e))
stream.on("end", () => console.log("finished parsing"))

// or 

const stream = mt940.readStream(fs.createReadStream("mt940.sta", {encoding: 'utf-8'}))
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
import * as mt940 from '@jewell-lgtm/mt940-js';

function onFileSelected(file) {
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
import * as mt940 from '@jewell-lgtm/mt940-js';

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

* [Buffer](https://nodejs.org/api/buffer.html)
* [ArrayBuffer](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### mt940 specification

* [Societe Generale spec.](https://web.archive.org/web/20160725042101/http://www.societegenerale.rs/fileadmin/template/main/pdf/SGS%20MT940.pdf)
* [Sepa spec.](http://www.sepaforcorporates.com/swift-for-corporates/account-statement-mt940-file-format-overview/)
* [Deutsche Bank spec.](https://deutschebank.nl/nl/docs/MT94042_EN.pdf)
