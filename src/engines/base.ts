import {Statement} from './../index';
import {compareArrays} from './../utils';

/**
 * @description colon, ":"
 * @type {number}
 */
const colonSymbolCode: number = 58;

/**
 * @description :20:
 * @type {Uint8Array}
 */
export const transactionReferenceNumberTag: Uint8Array = new Uint8Array([colonSymbolCode, 50, 48, colonSymbolCode]);
export const transactionReferenceNumberTagLength: number = transactionReferenceNumberTag.length;

/**
 * @description :21:
 * @type {Uint8Array}
 */
export const relatedReferenceTag: Uint8Array = new Uint8Array([colonSymbolCode, 50, 49, colonSymbolCode]);

/**
 * @description :25:
 * @type {Uint8Array}
 */
export const accountIdTag: Uint8Array = new Uint8Array([colonSymbolCode, 50, 53, colonSymbolCode]);

/**
 * @description :28:
 * @type {Uint8Array}
 */
export const accountIdTag1: Uint8Array = new Uint8Array([colonSymbolCode, 50, 56, colonSymbolCode]);

/**
 * @description :28C:
 * @type {Uint8Array}
 */
export const accountIdTag2: Uint8Array = new Uint8Array([colonSymbolCode, 50, 56, 67, colonSymbolCode]);

/**
 * @description :60M:
 * @type {Uint8Array}
 */
export const openingBalanceTag1: Uint8Array = new Uint8Array([colonSymbolCode, 54, 48, 77, colonSymbolCode]);

/**
 * @description :60F:
 * @type {Uint8Array}
 */
export const openingBalanceTag2: Uint8Array = new Uint8Array([colonSymbolCode, 54, 48, 70, colonSymbolCode]);

/**
 * @description :61:
 * @type {Uint8Array}
 */
export const statementTag: Uint8Array = new Uint8Array([colonSymbolCode, 54, 49, colonSymbolCode]);

/**
 * @description :62M:
 * @type {Uint8Array}
 */
export const closingBalanceTag1: Uint8Array = new Uint8Array([colonSymbolCode, 54, 50, 77, colonSymbolCode]);

/**
 * @description :62F:
 * @type {Uint8Array}
 */
export const closingBalanceTag2: Uint8Array = new Uint8Array([colonSymbolCode, 54, 50, 70, colonSymbolCode]);

/**
 * @description :64:
 * @type {Uint8Array}
 */
export const closingAvailableBalanceTag: Uint8Array = new Uint8Array([colonSymbolCode, 54, 52, colonSymbolCode]);

/**
 * @description :65:
 * @type {Uint8Array}
 */
export const forwardAvailableBalanceTag: Uint8Array = new Uint8Array([colonSymbolCode, 54, 53, colonSymbolCode]);

/**
 * @description :86:
 * @type {Uint8Array}
 */
export const informationTag: Uint8Array = new Uint8Array([colonSymbolCode, 56, 54, colonSymbolCode]);

export function test (data: Uint8Array|Buffer): boolean {
    return true;
}

export function read (data: Uint8Array|Buffer): Promise<Statement[]> {
    let i: number = 0;
    const length: number = data.length;
    const result: Statement[] = [];

    while (i < length) {
        const symbolCode: number = data[i];

        if (symbolCode === colonSymbolCode) {
            if (compareArrays(
                transactionReferenceNumberTag,
                0,
                data,
                i,
                transactionReferenceNumberTagLength
            )) {

            }
        }

        i++;
    }

    return Promise.resolve(result);
}