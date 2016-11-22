import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State} from './../typings';

/**
 * @description :61:
 * @type {Uint8Array}
 */
export const token: Uint8Array = new Uint8Array([colonSymbolCode, 54, 49, colonSymbolCode]);
const tokenLength: number = token.length;
const transactionInfo: Tag = {
    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        state.pos += tokenLength - 1;
        return true;
    },

    read (state: State, symbolCode: number) {

    }
};

export default transactionInfo;
