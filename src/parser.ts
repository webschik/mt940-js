import {colonSymbolCode} from './tokens';
import {Tag, State, Statement, Transaction} from './typings';
import transactionReferenceNumber from './tags/transaction-reference-number';
import relatedReferenceNumber from './tags/related-reference-number';
import accountId from './tags/account-id';
import statementNumber from './tags/statement-number';
import openingBalance from './tags/opening-balance';
import closingAvailableBalance from './tags/closing-available-balance';
import forwardAvailableBalance from './tags/forward-available-balance';
import closingBalance from './tags/closing-balance';
import informationForAccountOwner from './tags/information-for-account-owner';
import transactionInfo from './tags/transaction-info';

const tags: Tag[] = [
    transactionReferenceNumber,
    relatedReferenceNumber,
    accountId,
    statementNumber,
    informationForAccountOwner,
    openingBalance,
    closingBalance,
    closingAvailableBalance,
    forwardAvailableBalance,
    transactionInfo
];

export function read (data: Uint8Array|Buffer): Promise<Statement[]> {
    const length: number = data.length;
    const state: State = {
        pos: 0,
        statementIndex: 0,
        transactionIndex: 0,
        data,
        statements: [{
            transactions: [
                {} as Transaction
            ]
        } as Statement]
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