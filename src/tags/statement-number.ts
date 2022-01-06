import {State, Statement, Tag} from '../index';
import {colonSymbolCode, slashSymbolCode} from '../tokens';
import bufferToText from '../utils/buffer-to-text';
import compareArrays from '../utils/compare-arrays';

/**
 * @description :28:
 * @type {Uint8Array}
 */
const token1: Uint8Array = new Uint8Array([colonSymbolCode, 50, 56, colonSymbolCode]);

/**
 * @description :28C:
 * @type {Uint8Array}
 */
const token2: Uint8Array = new Uint8Array([colonSymbolCode, 50, 56, 67, colonSymbolCode]);
const token1Length: number = token1.length;
const token2Length: number = token2.length;

interface StatementNumberTag extends Tag {
    slashPos?: number;
}

const statementNumberTag: StatementNumberTag = {
    readToken(state: State) {
        const isToken1: boolean = compareArrays(token1, 0, state.buffer, state.pos, token1Length);
        const isToken2: boolean = !isToken1 && compareArrays(token2, 0, state.buffer, state.pos, token2Length);

        if (!isToken1 && !isToken2) {
            return 0;
        }

        this.slashPos = 0;
        return state.pos + (isToken1 ? token1Length : token2Length);
    },

    readContent(state: State, symbolCode: number) {
        if (symbolCode === slashSymbolCode) {
            this.slashPos = state.pos;
        }
    },

    close(state: State) {
        const statement: Statement | undefined = state.statements[state.statementIndex];

        if (!statement) {
            return;
        }

        statement.number = bufferToText(state.buffer, state.tagContentStart, this.slashPos || state.tagContentEnd);
    }
};

export default statementNumberTag;
