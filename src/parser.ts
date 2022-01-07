import {ReadOptions, State, Statement} from './index';
import {colonSymbolCode, newLineSymbolCode, returnSymbolCode} from './tokens';
import {Readable} from 'stream';
import {createRefreshBuffer} from './utils/create-refresh-buffer';
import {tags} from './tags';

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
        data: Buffer.alloc(0),
        prevSymbolCode: -1
    };

    const refreshBuffer = createRefreshBuffer(stream, state);
    await refreshBuffer();
    while (state.pos < state.data.length) {
        await refreshBuffer();
        const symbolCode: number = state.data[state.pos];
        let skipReading: boolean = false;
        if (symbolCode === colonSymbolCode && (state.pos === 0 || state.prevSymbolCode === newLineSymbolCode)) {
            for (const tag of tags) {
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
                state.tag.readContent(state, state.data[state.pos]);
            }
        }
        state.prevSymbolCode = symbolCode;
        state.pos++;
    }
    closeCurrentTag(state, options);

    return state.statements;
}
