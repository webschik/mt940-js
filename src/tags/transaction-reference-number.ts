import {State, Statement, Tag} from '../index';
import {colonSymbolCode} from '../tokens';
import bufferToText from '../utils/buffer-to-text';
import compareArrays from '../utils/compare-arrays';

/**
 * @description :20:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 50, 48, colonSymbolCode]);
const tokenLength: number = token.length;
const transactionReferenceNumberTag: Tag = {
    readToken(state: State) {
        if (!compareArrays(token, 0, state.buffer, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    open(state: State) {
        state.statementIndex++;
        state.transactionIndex = -1;
        state.statements.push({
            transactions: []
        });
    },

    close(state: State) {
        const statement: Statement | undefined = state.statements[state.statementIndex];

        if (!statement) {
            return;
        }

        statement.referenceNumber = bufferToText(state.buffer, state.tagContentStart, state.tagContentEnd);
    }
};

export default transactionReferenceNumberTag;
