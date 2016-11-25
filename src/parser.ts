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
const tagsCount: number = tags.length;

function closeCurrentTag (state: State) {
    if (state.tag && state.tag.close) {
        state.tag.close(state);
    }
}

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

        // check if it's a tag
        if (symbolCode === colonSymbolCode && (state.pos === 0 || data[state.pos - 1] === newLineSymbolCode)) {
            for (let i = 0; i < tagsCount; i++) {
                const tag: Tag = tags[i];
                const newPos: number = tag.readToken(state);

                if (newPos) {
                    closeCurrentTag(state);
                    state.pos = newPos;
                    state.tagContentStart = newPos;
                    state.tagContentEnd = newPos;
                    state.tag = tag;

                    if (state.tag.open) {
                        state.tag.open(state);
                    }
                    break;
                }
            }
        } else if (symbolCode === newLineSymbolCode || symbolCode === returnSymbolCode) {
            skipReading = !state.tag || !state.tag.multiline;
        }

        if (!skipReading && state.tag) {
            state.tagContentEnd++;

            if (state.tag.readContent) {
                state.tag.readContent(state, data[state.pos]);
            }
        }

        state.pos++;
    }

    closeCurrentTag(state);

    return Promise.resolve(state.statements);
}