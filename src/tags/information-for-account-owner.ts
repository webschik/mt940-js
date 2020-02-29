import compareArrays from '../utils/compare-arrays';
import { colonSymbolCode, returnSymbolCode, newLineSymbolCode, spaceSymbolCode } from './../tokens';
import { Tag, State, Statement } from './../index';

/**
 * @description :86:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 56, 54, colonSymbolCode]);
const tokenLength: number = token.length;
const informationTag: Tag = {
    multiline: true,

    readToken(state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    close(state: State) {
        const statement: Statement = state.statements[state.statementIndex];
        const description: number[] = [];
        let descriptionLength: number = 0;

        // filter denied symbols
        for (let i = state.tagContentStart; i < state.tagContentEnd; i++) {
            const symbolCode: number = state.data[i];

            if (
                // remove \r & \n
                symbolCode !== returnSymbolCode && symbolCode !== newLineSymbolCode && (
                    // use 1 space instead of multiple ones
                    symbolCode !== spaceSymbolCode || description[descriptionLength - 1] !== symbolCode
                )
            ) {
                description[descriptionLength] = symbolCode;
                descriptionLength++;
            }
        }

        const informationToAccountOwner = String.fromCharCode.apply(
            String,
            description
        ).trim();

        const hasTransactions = state.transactionIndex >= 0;
        const transactionHasDescription = statement.transactions[state.transactionIndex] &&
            statement.transactions[state.transactionIndex].description !== '';

        // Normally, all :86: fields must be directly preceded by a transaction statement
        // line (:61:), so if the current transaction already has a description, we may
        // assume this is yet another :86: field, and therefore contains additional
        // information about the statement as a whole rather than just about the transaction.
        // Or, if no transactions at all have been encountered, and we see an :86: field, it
        // then must pertain to the account statement.
        if (hasTransactions && transactionHasDescription === false) {
            statement.transactions[state.transactionIndex].description = informationToAccountOwner;
        } else {
            statement.additionalInformation = informationToAccountOwner;
        }
    }
};

export default informationTag;
