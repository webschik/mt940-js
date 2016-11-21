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

        state.statements[state.statementIndex].accountId = '';
        state.pos += tokenLength - 1;
        return true;
    },

    read (state: State, symbolCode: number) {
        state.statements[state.statementIndex].accountId += String.fromCharCode(symbolCode);
    }
};

export default accountIdTag;