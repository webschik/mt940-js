import {State, Statement} from '../index';
import {bigCSymbolCode, colonSymbolCode, commaSymbolCode, dotSymbolCode, nineSymbolCode} from '../tokens';
import bufferToText from '../utils/buffer-to-text';
import compareArrays from '../utils/compare-arrays';
import {BalanceInfoTag} from './balance-info';

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
const getInitialState = (): Pick<BalanceInfoTag, 'info' | 'contentPos' | 'balance'> => {
    return {
        info: {
            isCredit: false,
            date: '',
            currency: '',
            value: 0
        },
        contentPos: 0,
        balance: []
    };
};

const openingBalanceTag: BalanceInfoTag = {
    ...getInitialState(),

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

        statement.openingBalance = this.info;
        return state.pos + (isToken1 ? token1Length : token2Length);
    },

    init() {
        Object.assign(this, getInitialState());
    },

    readContent(_state: State, symbolCode: number) {
        const {info, contentPos} = this;

        if (!contentPos) {
            // status is 'C'
            info.isCredit = symbolCode === bigCSymbolCode;
        } else if (contentPos < 7) {
            // it's a date. Collect date and convert it from YYMMDD to YYYY-MM-DD
            if (!info.date) {
                if (symbolCode === nineSymbolCode) {
                    info.date = '19';
                } else {
                    info.date = '20';
                }
            }

            info.date += String.fromCharCode(symbolCode);

            if (contentPos === 2 || contentPos === 4) {
                info.date += '-';
            }
        } else if (contentPos < 10) {
            // it's a currency
            info.currency += String.fromCharCode(symbolCode);
        } else {
            // it's a balance
            // use always a dot as decimal separator
            if (symbolCode === commaSymbolCode) {
                symbolCode = dotSymbolCode;
            }

            this.balance.push(symbolCode);
        }

        this.contentPos++;
    },

    close() {
        this.info.value = parseFloat(bufferToText(this.balance));
    }
};

export default openingBalanceTag;
