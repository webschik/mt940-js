import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State, Transaction} from './../typings';

/**
 * @description :61:
 * @type {Uint8Array}
 */
export const token: Uint8Array = new Uint8Array([colonSymbolCode, 54, 49, colonSymbolCode]);
const tokenLength: number = token.length;
const transactionInfo: Tag = {
    multiline: true,

    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        state.transactionIndex++;
        state.statements[state.statementIndex].transactions.push({} as Transaction);
        state.pos += tokenLength;
        return true;
    },

    read (state: State, symbolCode: number) {
        //
    }
};

export default transactionInfo;
