## 0.1.0
* reading of the documents according to [mt940 specification](README.md#mt940-specification)

## 0.2.0
* added `npm-shrinkwrap.json`
* added `Transaction`, `BalanceInfo` interfaces to `.d.ts` file

## 0.3.0
* Transaction description
    * filter symbols `\r`, `\n`
    * replace multiple spaces by 1 space symbol
    
## 0.4.0
* added `id` property to transaction info
* added `isExpense` property to transaction info