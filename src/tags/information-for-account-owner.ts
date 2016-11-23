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
    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        state.pos += tokenLength;
        this.contentStartPos = state.pos;
        return true;
    },

    close (state: State, currentPosition: number) {
        const statement: Statement = state.statements[state.statementIndex];

        statement.transactions[state.transactionIndex].description = String.fromCharCode.apply(
            String,
            state.data.slice(this.contentStartPos, currentPosition)
        );
    }
};

export default informationTag;
