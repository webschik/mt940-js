import {compareArrays} from './../utils';
import {colonSymbolCode, bigCSymbolCode, dotSymbolCode} from './../tokens';
import {Tag, State, Statement, Transaction} from './../typings';

const transactionInfoPattern: RegExp = new RegExp([
    '^\\\s*',
    '([0-9]{2})', // YY
    '([0-9]{2})', // MM
    '([0-9]{2})', // DD
    '([0-9]{2})?', // MM
    '([0-9]{2})?', // DD
    '(C|D|RD|RC)',
    '([A-Z]{1})?', // Funds code
    '([0-9,\.]+)',// Amount
    '([A-Z0-9]{4})'// Transaction code
].join(''));
const commaPattern: RegExp = /,/;
const dotSymbol: string = String.fromCharCode(dotSymbolCode);

/**
 * @description :61:
 * @type {Uint8Array}
 */
export const token: Uint8Array = new Uint8Array([colonSymbolCode, 54, 49, colonSymbolCode]);
const tokenLength: number = token.length;
const transactionInfoTag: Tag = {
    readToken (state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    open (state: State) {
        const statement: Statement = state.statements[state.statementIndex];

        state.transactionIndex++;
        statement.transactions.push({
            code: '',
            fundsCode: '',
            isCredit: false,
            currency: statement.openingBalance.currency,
            description: '',
            amount: 0,
            valueDate: '',
            entryDate: ''
        });
    },

    close (state: State) {
        const transaction: Transaction = state.statements[state.statementIndex].transactions[state.transactionIndex];
        const content: string = String.fromCharCode.apply(
            String,
            state.data.slice(state.tagContentStart, state.tagContentEnd)
        );
        const [,
            valueDateYear,
            valueDateMonth,
            valueDate,
            entryDateMonth,
            entryDate,
            creditMark,
            fundsCode,
            amount,
            code
        ]: RegExpExecArray = (transactionInfoPattern.exec(content) || []) as RegExpExecArray;

        if (!valueDateYear) {
            return;
        }

        const year: string = Number(valueDateYear) > 80 ? `19${ valueDateYear }` : `20${ valueDateYear }`;

        transaction.valueDate = `${ year }-${ valueDateMonth }-${ valueDate }`;

        if (entryDateMonth) {
            transaction.entryDate = `${ year }-${ entryDateMonth }-${ entryDate }`;
        }

        transaction.isCredit = (
            creditMark && (creditMark.charCodeAt(0) === bigCSymbolCode || creditMark.charCodeAt(1) === bigCSymbolCode)
        );

        if (fundsCode) {
            transaction.fundsCode = fundsCode;
        }

        transaction.amount = parseFloat(amount.replace(commaPattern, dotSymbol));
        transaction.code = code;
    }
};

export default transactionInfoTag;
