import {compareArrays} from './../utils';
import {colonSymbolCode, bigCSymbolCode} from './../tokens';
import {Tag, State, Statement, Transaction} from './../typings';

const transactionInfoPattern: RegExp = new RegExp([
    '^\\\s*',
    '(\d{2})', // YY
    '(\d{2})', // MM
    '(\d{2})', // DD
    '(\d{2})?', // MM
    '(\d{2})?', // DD
    '(C|D|RD|RC)',
    '([A-Z]{1})?', // Funds code
    '([0-9,\.]+)',// Amount
    '\\\s*$'
].join(''));

/**
 * @description :61:
 * @type {Uint8Array}
 */
export const token: Uint8Array = new Uint8Array([colonSymbolCode, 54, 49, colonSymbolCode]);
const tokenLength: number = token.length;
const transactionInfo: Tag = {
    multiline: true,

    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        const statement: Statement = state.statements[state.statementIndex];

        state.transactionIndex++;
        statement.transactions.push({
            typeCode: '',
            isCredit: false,
            currency: statement.openingBalance.currency,
            number: '',
            description: '',
            amount: 0,
            valueDate: '',
            entryDate: ''
        });
        state.pos += tokenLength;
        this.contentStartPos = state.pos;
        return true;
    },

    close (state: State, currentPosition: number) {
        const {contentStartPos} = this;
        const transaction: Transaction = state.statements[state.statementIndex].transactions[state.transactionIndex];
        const content: string = String.fromCharCode.apply(String, state.data.slice(contentStartPos, currentPosition));
        const info: RegExpExecArray = transactionInfoPattern.exec(content);

        if (!info) {
            return;
        }

        const [,
            valueDateYear,
            valueDateMonth,
            valueDateDay,
            entryDateMonth,
            entryDateDay,
            transactionType
        ] = info;
        const year: string = Number(valueDateYear) > 80 ? `19${ valueDateYear }` : `20${ valueDateYear }`;

        transaction.valueDate = `${ year }-${ valueDateMonth }-${ valueDateDay }`;
        transaction.entryDate = `${ year }-${ entryDateMonth }-${ entryDateDay }`;
        transaction.isCredit = (
            transactionType.charCodeAt(0) === bigCSymbolCode ||
            transactionType.charCodeAt(1) === bigCSymbolCode
        );
    }
};

export default transactionInfo;
