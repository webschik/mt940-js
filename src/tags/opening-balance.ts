import {compareArrays} from './../utils';
import {colonSymbolCode, bigCSymbolCode, nineSymbolCode, dotSymbolCode, commaSymbolCode} from './../tokens';
import {Tag, State, BalanceInfo} from './../typings';

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

export interface BalanceInfoTag extends Tag {
    info?: BalanceInfo;
    getInfo?: () => BalanceInfo;
    collectDate?: (currentValue: string, symbolCode: number, dateContentPos: number) => string;
}

const openingBalanceTag: BalanceInfoTag = {
    open (state: State): boolean {
        const isToken1: boolean = compareArrays(token1, 0, state.data, state.pos, token1Length);
        const isToken2: boolean = !isToken1 && compareArrays(token2, 0, state.data, state.pos, token2Length);

        if (!isToken1 && !isToken2) {
            return false;
        }

        this.info = this.getInfo();
        this.contentPos = 0;
        this.balance = [];
        state.statements[state.statementIndex].openingBalance = this.info;
        state.pos += isToken1 ? token1Length : token2Length;
        return true;
    },

    getInfo () {
        return {
            isCredit: false,
            date: '',
            currency: '',
            value: 0
        };
    },

    /**
     * @description Collect date and convert it from YYMMDD to YYYY-MM-DD
     * @param {string} currentValue
     * @param {number} symbolCode
     * @param {number} dateContentPos
     * @returns {string}
     */
    collectDate (currentValue: string, symbolCode: number, dateContentPos: number): string {
        if (!currentValue) {
            if (symbolCode === nineSymbolCode) {
                currentValue = '19';
            } else {
                currentValue = '20';
            }
        }

        currentValue += String.fromCharCode(symbolCode);

        if (dateContentPos === 1 || dateContentPos === 3) {
            currentValue += '-';
        }

        return currentValue;
    },

    read (state: State, symbolCode: number) {
        const {info, contentPos} = this;

        if (!contentPos) {
            // status is 'C'
            info.isCredit = symbolCode === bigCSymbolCode;
        } else if (contentPos < 7) {
            // it's a date
            info.date = this.collectDate(info.date, symbolCode, contentPos - 1);
        } else if (contentPos < 10) {
            // it's a currency
            info.currency += String.fromCharCode(symbolCode);
        } else {
            // it's a balance
            // use always a dot as decimal separator
            if (symbolCode === commaSymbolCode){
                symbolCode = dotSymbolCode;
            }

            this.balance.push(symbolCode);
        }

        this.contentPos++;
    },

    close () {
        this.info.value = parseFloat(String.fromCharCode.apply(String, this.balance));
    }
};

export default openingBalanceTag;