import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import openingBalanceTag, {BalanceInfoTag} from './opening-balance';
import {State} from './../typings';

/**
 * @description :62M:
 * @type {Uint8Array}
 */
export const token1: Uint8Array = new Uint8Array([colonSymbolCode, 54, 50, 77, colonSymbolCode]);

/**
 * @description :62F:
 * @type {Uint8Array}
 */
export const token2: Uint8Array = new Uint8Array([colonSymbolCode, 54, 50, 70, colonSymbolCode]);
const token1Length: number = token1.length;
const token2Length: number = token2.length;
const closingBalanceTag: BalanceInfoTag = {
    open (state: State): boolean {
        const isToken1: boolean = compareArrays(token1, 0, state.data, state.pos, token1Length);
        const isToken2: boolean = !isToken1 && compareArrays(token2, 0, state.data, state.pos, token2Length);

        if (!isToken1 && !isToken2) {
            return false;
        }

        this.info = openingBalanceTag.getInfo();
        state.statements[state.statementIndex].closingBalance = this.info;
        state.pos += isToken1 ? token1Length : token2Length;
        return true;
    },

    read: openingBalanceTag.read
};

export default closingBalanceTag;