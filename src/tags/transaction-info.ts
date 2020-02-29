import {ReadOptions, State, Statement, Tag, Transaction} from '../index';
import {bigCSymbolCode, colonSymbolCode, dotSymbolCode} from '../tokens';
import bufferToText from '../utils/buffer-to-text';
import compareArrays from '../utils/compare-arrays';

const transactionInfoPattern: RegExp = new RegExp(
    [
        '^\\s*',
        '([0-9]{2})', // YY
        '([0-9]{2})', // MM
        '([0-9]{2})', // DD
        '([0-9]{2})?', // MM
        '([0-9]{2})?', // DD
        '(C|D|RD|RC)',
        '([A-Z]{1})?', // Funds code
        '([0-9]+[,.][0-9]*)', // Amount
        '([A-Z0-9]{4})?', // Transaction code
        '([^/\n\r]{0,16}|NONREF)?', // Customer reference
        '(//[A-Z0-9]{16})?' // Bank reference
    ].join('')
);
const commaPattern: RegExp = /,/;
const dotSymbol: string = String.fromCharCode(dotSymbolCode);
const incomeTransactionCodes: string[] = [
    // ABN AMRO bank
    'N653',
    'N654',

    // ING bank
    'N060'
];

/**
 * @description :61:
 * @type {Uint8Array}
 */
export const token: Uint8Array = new Uint8Array([colonSymbolCode, 54, 49, colonSymbolCode]);
const tokenLength: number = token.length;
const transactionInfoTag: Tag = {
    readToken(state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    open(state: State) {
        const statement: Statement | undefined = state.statements[state.statementIndex];

        if (statement) {
            const {openingBalance} = statement;

            statement.transactions.push({
                id: '',
                code: '',
                fundsCode: '',
                isCredit: false,
                isExpense: true,
                currency: openingBalance ? openingBalance.currency : '',
                description: '',
                amount: 0,
                valueDate: '',
                entryDate: '',
                customerReference: '',
                bankReference: ''
            });
        }

        state.transactionIndex++;
    },

    close(state: State, options: ReadOptions) {
        const statement: Statement | undefined = state.statements[state.statementIndex];
        const transaction: Transaction | undefined = statement && statement.transactions[state.transactionIndex];

        if (!transaction) {
            return;
        }

        const content: string = bufferToText(state.data, state.tagContentStart, state.tagContentEnd);
        const [
            ,
            valueDateYear,
            valueDateMonth,
            valueDate,
            entryDateMonth,
            entryDate,
            creditMark,
            fundsCode,
            amount,
            code,
            customerReference,
            bankReference
        ]: RegExpExecArray | string[] = transactionInfoPattern.exec(content) || [];

        if (!valueDateYear) {
            return;
        }

        const year: string = Number(valueDateYear) > 80 ? `19${valueDateYear}` : `20${valueDateYear}`;

        transaction.valueDate = `${year}-${valueDateMonth}-${valueDate}`;

        if (entryDateMonth) {
            transaction.entryDate = `${year}-${entryDateMonth}-${entryDate}`;
        }

        transaction.isCredit = creditMark
            ? creditMark.charCodeAt(0) === bigCSymbolCode || creditMark.charCodeAt(1) === bigCSymbolCode
            : false;

        if (fundsCode) {
            transaction.fundsCode = fundsCode;
        }

        if (customerReference && customerReference !== 'NONREF') {
            transaction.customerReference = customerReference;
        }

        if (bankReference && bankReference !== '//NONREF') {
            transaction.bankReference = bankReference.slice(2);
        }

        transaction.amount = parseFloat(amount.replace(commaPattern, dotSymbol));
        transaction.code = code;
        transaction.isExpense = incomeTransactionCodes.indexOf(code) === -1;
        transaction.id = options.getTransactionId(transaction, state.transactionIndex);
    }
};

export default transactionInfoTag;
