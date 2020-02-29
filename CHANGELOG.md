## 1.0.0
* fix transaction description parsing (see https://github.com/webschik/mt940-js/issues/12)
* updated development tools
* first major release :)

## 0.6.0
* **Breaking change**: [new transaction id generator](README.md#readoptions)

## 0.5.2
* fix parsing of customer and bank references

## 0.5.1
* fix transactions parsing

## 0.5.0
* parse bank and customer references in transaction info, tag :61:
* refactoring. Build the module only with Typescript, without Webpack

## 0.4.1
* removed Webpack polyfills
    
## 0.4.0
* added `id` property to transaction info
* added `isExpense` property to transaction info

## 0.3.0
* Transaction description
    * filter symbols `\r`, `\n`
    * replace multiple spaces by 1 space symbol
    
## 0.2.0
* added `npm-shrinkwrap.json`
* added `Transaction`, `BalanceInfo` interfaces to `.d.ts` file

## 0.1.0
* reading of the documents according to [mt940 specification](README.md#mt940-specification)