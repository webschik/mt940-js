import compareArrays from '../utils/compare-arrays';
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
    readToken (state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        openingBalanceTag.init.call(this);
        state.statements[state.statementIndex].forwardAvailableBalance = this.info;
        return state.pos + tokenLength;
    },

    readContent: openingBalanceTag.readContent,
    close: openingBalanceTag.close
};

export default forwardAvailableBalance;