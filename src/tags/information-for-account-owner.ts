import {compareArrays} from './../utils';
import {colonSymbolCode} from './../tokens';
import {Tag, State, Statement, Transaction} from './../typings';

/**
 * @description :86:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 56, 54, colonSymbolCode]);
const tokenLength: number = token.length;
const informationTag: Tag = {
    open (state: State): boolean {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return false;
        }

        const statement: Statement = state.statements[state.statementIndex];
        const transaction: Transaction = statement.transactions[state.transactionIndex];

        transaction.description = '';
        state.pos += tokenLength;
        return true;
    },

    read (state: State, symbolCode: number) {
        const statement: Statement = state.statements[state.statementIndex];
        const transaction: Transaction = statement.transactions[state.transactionIndex];

        transaction.description += String.fromCharCode(symbolCode);
    }
};

export default informationTag;
