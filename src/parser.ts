import {ReadOptions, State, Statement, Tag} from './index';
import accountId from './tags/account-id';
import closingAvailableBalance from './tags/closing-available-balance';
import closingBalance from './tags/closing-balance';
import forwardAvailableBalance from './tags/forward-available-balance';
import informationForAccountOwner from './tags/information-for-account-owner';
import openingBalance from './tags/opening-balance';
import relatedReferenceNumber from './tags/related-reference-number';
import statementNumber from './tags/statement-number';
import transactionInfo from './tags/transaction-info';
import transactionReferenceNumber from './tags/transaction-reference-number';
import {colonSymbolCode, newLineSymbolCode, returnSymbolCode} from './tokens';
import {Readable} from 'stream';
import {createRefreshBuffer} from './utils/create-refresh-buffer';

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

function closeCurrentTag(state: State, options: ReadOptions) {
    if (state.tag && state.tag.close) {
        state.tag.close(state, options);
    }
}

export async function read(stream: Readable, options: ReadOptions): Promise<Statement[]> {
    const state: State = {
        pos: 0,
        statementIndex: -1,
        transactionIndex: -1,
        statements: [],
        buffer: Buffer.from([])
    };
    const refreshBuffer = createRefreshBuffer(stream, state);

    await refreshBuffer();
    while (state.pos < state.buffer.length) {
        const symbolCode: number = state.buffer[state.pos];
        let skipReading: boolean = false;
        // check if it's a tag
        if (symbolCode === colonSymbolCode && (state.pos === 0 || state.buffer[state.pos - 1] === newLineSymbolCode)) {
            for (let i = 0; i < tagsCount; i++) {
                const tag: Tag = tags[i];
                const newPos: number = tag.readToken(state);
                if (newPos > 0) {
                    closeCurrentTag(state, options);
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
            if (state.tagContentEnd !== undefined) {
                state.tagContentEnd++;
            }
            if (typeof state.tag.readContent === 'function') {
                state.tag.readContent(state, state.buffer[state.pos]);
            }
        }
        state.pos++;
        await refreshBuffer();
    }
    closeCurrentTag(state, options);

    return state.statements;
}
