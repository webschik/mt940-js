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
        this.contentStartPos = state.pos;
        return true;
    },

    close (state: State, currentPosition: number) {
        state.statements[state.statementIndex].accountId = String.fromCharCode.apply(
            String,
            state.data.slice(this.contentStartPos, currentPosition)
        );
    }
};

export default accountIdTag;