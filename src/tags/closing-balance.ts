import {State, Statement} from '../index';
import {colonSymbolCode} from '../tokens';
import compareArrays from '../utils/compare-arrays';
import {BalanceInfoTag} from './balance-info';
import openingBalanceTag from './opening-balance';

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
    ...openingBalanceTag,

    readToken(state: State) {
        const isToken1: boolean = compareArrays(token1, 0, state.data, state.pos, token1Length);
        const isToken2: boolean = !isToken1 && compareArrays(token2, 0, state.data, state.pos, token2Length);

        if (!isToken1 && !isToken2) {
            return 0;
        }

        this.init();
        const statement: Statement | undefined = state.statements[state.statementIndex];

        if (!statement) {
            return 0;
        }

        statement.closingBalance = this.info;
        return state.pos + (isToken1 ? token1Length : token2Length);
    }
};

export default closingBalanceTag;
