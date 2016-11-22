import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import openingBalanceTag, {BalanceInfoTag} from './opening-balance';
import {State} from './../typings';

/**
 * @description :65:
 * @type {Uint8Array}
 */
export const token: Uint8Array = new Uint8Array([colonSymbolCode, 54, 53, colonSymbolCode]);

const tokenLength: number = token.length;
const forwardAvailableBalance: BalanceInfoTag = {
    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        this.info = openingBalanceTag.getInfo();
        state.statements[state.statementIndex].closingAvailableBalance = this.info;
        state.pos += tokenLength;
        return true;
    },

    read: openingBalanceTag.read
};

export default forwardAvailableBalance;