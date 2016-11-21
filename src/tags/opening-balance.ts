import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State} from './../typings';

/**
 * @description :60M:
 * @type {Uint8Array}
 */
const token1: Uint8Array = new Uint8Array([colonSymbolCode, 54, 48, 77, colonSymbolCode]);

/**
 * @description :60F:
 * @type {Uint8Array}
 */
const token2: Uint8Array = new Uint8Array([colonSymbolCode, 54, 48, 70, colonSymbolCode]);
const token1Length: number = token1.length;
const token2Length: number = token2.length;
const openingBalanceTag: Tag = {
    open (state: State): boolean {
        const isToken1: boolean = compareArrays(token1, 0, state.data, state.pos, token1Length);
        const isToken2: boolean = !isToken1 && compareArrays(token2, 0, state.data, state.pos, token2Length);

        if (!isToken1 && !isToken2) {
            return false;
        }

        state.statements[state.statementIndex].openingBalance = {
            isCredit: false,
            date: '',
            currency: '',
            value: 0
        };
        state.pos += (isToken1 ? token1Length : token2Length) - 1;
        return true;
    },

    read (state: State, symbolCode: number) {

    }
};

export default openingBalanceTag;