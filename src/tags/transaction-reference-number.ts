import compareArrays from '../utils/compare-arrays';
import {colonSymbolCode} from './../tokens';
import {Tag, State, Statement} from './../index';

/**
 * @description :20:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 50, 48, colonSymbolCode]);
const tokenLength: number = token.length;
const transactionReferenceNumberTag: Tag = {
    readToken (state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    open (state: State) {
        state.statementIndex++;
        state.transactionIndex = -1;
        state.statements.push({
            transactions: []
        } as Statement);
    },

    close (state: State) {
        state.statements[state.statementIndex].referenceNumber = String.fromCharCode.apply(
            String,
            state.data.slice(state.tagContentStart, state.tagContentEnd)
        );
    }
};

export default transactionReferenceNumberTag;