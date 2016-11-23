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
    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        state.pos += tokenLength;
        this.start = state.pos;
        this.end = state.pos;
        return true;
    },

    read () {
        this.end++;
    },

    close (state: State) {
        state.statements[state.statementIndex].accountId = String.fromCharCode.apply(
            String,
            state.data.slice(this.start, this.end)
        );
    }
};

export default accountIdTag;