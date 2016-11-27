import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State, Statement} from './../typings';

/**
 * @description :86:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 56, 54, colonSymbolCode]);
const tokenLength: number = token.length;
const informationTag: Tag = {
    multiline: true,

    readToken (state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    close (state: State) {
        const statement: Statement = state.statements[state.statementIndex];

        statement.transactions[state.transactionIndex].description = String.fromCharCode.apply(
            String,
            state.data.slice(state.tagContentStart, state.tagContentEnd)
        ).trim();
    }
};

export default informationTag;
