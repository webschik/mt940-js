import {
    colonSymbolCode,
    newLineSymbolCode,
    returnSymbolCode
} from './tokens';
import {Tag, State, Statement} from './typings';
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
        statementIndex: -1,
        transactionIndex: -1,
        data,
        statements: []
    };

    while (state.pos < length) {
        const symbolCode: number = data[state.pos];
        let skipReading: boolean = false;

        if (symbolCode === colonSymbolCode) {
            tags.some((tag: Tag) => {
                const isTagOpened: boolean = tag.open(state);

                if (isTagOpened) {
                    if (state.tag && state.tag.close) {
                        state.tag.close(state);
                    }

                    state.tag = tag;
                }

                return isTagOpened;
            });
        } else if (symbolCode === newLineSymbolCode || symbolCode === returnSymbolCode) {
            skipReading = !state.tag || !state.tag.multiline;
        }

        if (!skipReading && state.tag) {
            state.tag.read(state, data[state.pos]);
        }

        state.pos++;
    }

    return Promise.resolve(state.statements);
}