import {State, Statement, Tag} from '../index';
import {colonSymbolCode} from '../tokens';
import bufferToText from '../utils/buffer-to-text';
import compareArrays from '../utils/compare-arrays';

/**
 * @description :25:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 50, 53, colonSymbolCode]);
const tokenLength: number = token.length;
const accountIdTag: Tag = {
    readToken(state: State) {
        if (!compareArrays(token, 0, state.buffer, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    close(state: State) {
        const statement: Statement | undefined = state.statements[state.statementIndex];

        if (!statement) {
            return;
        }

        statement.accountId = bufferToText(state.buffer, state.tagContentStart, state.tagContentEnd);
    }
};

export default accountIdTag;
