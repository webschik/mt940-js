import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State} from './../typings';

/**
 * @description :21:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 50, 49, colonSymbolCode]);
const tokenLength: number = token.length;
const relatedReferenceNumberTag: Tag = {
    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        state.pos += tokenLength;
        this.start = state.pos;
        this.end = state.pos + 1;
        return true;
    },

    read () {
        this.end++;
    },

    close (state: State) {
        state.statements[state.statementIndex].relatedReferenceNumber = String.fromCharCode.apply(
            String,
            state.data.slice(this.start, this.end + 1)
        );
    }
};

export default relatedReferenceNumberTag;