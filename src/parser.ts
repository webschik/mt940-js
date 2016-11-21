import {colonSymbolCode} from './tokens';
import {Tag, State, Statement} from './typings';
import transactionReferenceNumber from './tags/transaction-reference-number';
import relatedReferenceNumber from './tags/related-reference-number';
import accountId from './tags/account-id';
import statementNumber from './tags/statement-number';

const tags: Tag[] = [
    transactionReferenceNumber,
    relatedReferenceNumber,
    accountId,
    statementNumber
];

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

export function read (data: Uint8Array|Buffer): Promise<Statement[]> {
    const length: number = data.length;
    const state: State = {
        pos: 0,
        statementIndex: 0,
        data,
        statements: [{} as Statement]
    };

    while (state.pos < length) {
        const symbolCode: number = data[state.pos];

        if (symbolCode === colonSymbolCode) {
            tags.some((tag: Tag) => tag.open(state));
        }

        if (state.tag) {
            state.tag.read(state, symbolCode);
        }

        state.pos++;
    }

    return Promise.resolve(state.statements);
}