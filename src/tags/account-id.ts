import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State} from './../typings';

/**
 * @description :25:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 50, 53, colonSymbolCode]);
const tokenLength: number = token.length;
const accountIdTag: Tag = {
    readToken (state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    close (state: State) {
        state.statements[state.statementIndex].accountId = String.fromCharCode.apply(
            String,
            state.data.slice(state.tagContentStart, state.tagContentEnd)
        );
    }
};

export default accountIdTag;