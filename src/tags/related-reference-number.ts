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

        state.statements[state.statementIndex].relatedReferenceNumber = '';
        state.pos += tokenLength - 1;
        return true;
    },

    read (state: State, symbolCode: number) {
        state.statements[state.statementIndex].relatedReferenceNumber += String.fromCharCode(symbolCode);
    }
};

export default relatedReferenceNumberTag;