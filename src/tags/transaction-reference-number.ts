import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State, Statement} from './../typings';

/**
 * @description :20:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 50, 48, colonSymbolCode]);
const tokenLength: number = token.length;
const transactionReferenceNumberTag: Tag = {
    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        state.statementIndex++;
        state.transactionIndex = -1;
        state.statements.push({
           transactions: []
        } as Statement);

        state.pos += tokenLength;
        this.start = state.pos;
        this.end = state.pos;
        return true;
    },

    read () {
        this.end++;
    },

    close (state: State) {
        state.statements[state.statementIndex].referenceNumber = String.fromCharCode.apply(
            String,
            state.data.slice(this.start, this.end)
        );
    }
};

export default transactionReferenceNumberTag;