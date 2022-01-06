import {State, Statement} from '../index';
import {colonSymbolCode} from '../tokens';
import compareArrays from '../utils/compare-arrays';
import {BalanceInfoTag} from './balance-info';
import openingBalanceTag from './opening-balance';

/**
 * @description :64:
 * @type {Uint8Array}
 */
export const token: Uint8Array = new Uint8Array([colonSymbolCode, 54, 52, colonSymbolCode]);

const tokenLength: number = token.length;
const closingAvailableBalance: BalanceInfoTag = {
    ...openingBalanceTag,

    readToken(state: State) {
        if (!compareArrays(token, 0, state.buffer, state.pos, tokenLength)) {
            return 0;
        }

        this.init();
        const statement: Statement | undefined = state.statements[state.statementIndex];

        if (!statement) {
            return 0;
        }

        statement.closingAvailableBalance = this.info;
        return state.pos + tokenLength;
    }
};

export default closingAvailableBalance;
