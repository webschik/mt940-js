import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import openingBalanceTag, {BalanceInfoTag} from './opening-balance';
import {State} from './../typings';

/**
 * @description :64:
 * @type {Uint8Array}
 */
export const token: Uint8Array = new Uint8Array([colonSymbolCode, 54, 52, colonSymbolCode]);

const tokenLength: number = token.length;
const closingAvailableBalance: BalanceInfoTag = {
    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        openingBalanceTag.init.call(this);
        state.statements[state.statementIndex].closingAvailableBalance = this.info;
        state.pos += tokenLength - 1;
        return true;
    },

    read: openingBalanceTag.read,
    close: openingBalanceTag.close
};

export default closingAvailableBalance;