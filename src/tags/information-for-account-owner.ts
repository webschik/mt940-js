import {State, Statement, Tag, Transaction} from '../index';
import {colonSymbolCode, newLineSymbolCode, returnSymbolCode, spaceSymbolCode} from '../tokens';
import bufferToText from '../utils/buffer-to-text';
import compareArrays from '../utils/compare-arrays';

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
        const statement: Statement | undefined = state.statements[state.statementIndex];

        if (!statement) {
            return;
        }

        const {tagContentStart = 0, tagContentEnd = 0} = state;
        const description: number[] = [];
        let descriptionLength: number = 0;

        // filter denied symbols
        for (let i: number = tagContentStart; i < tagContentEnd; i++) {
            const symbolCode: number = state.data[i];

            if (
                // remove \r & \n
                symbolCode !== returnSymbolCode &&
                symbolCode !== newLineSymbolCode &&
                // use 1 space instead of multiple ones
                (symbolCode !== spaceSymbolCode || description[descriptionLength - 1] !== symbolCode)
            ) {
                description[descriptionLength] = symbolCode;
                descriptionLength++;
            }
        }

        const informationToAccountOwner = bufferToText(description).trim();
        const currentTransaction: Transaction | undefined = statement.transactions[state.transactionIndex];

        // Normally, all :86: fields must be directly preceded by a transaction statement
        // line (:61:), so if the current transaction already has a description, we may
        // assume this is yet another :86: field, and therefore contains additional
        // information about the statement as a whole rather than just about the transaction.
        // Or, if no transactions at all have been encountered, and we see an :86: field, it
        // then must pertain to the account statement.
        if (currentTransaction && !currentTransaction.description) {
            currentTransaction.description = informationToAccountOwner;
        } else {
            statement.additionalInformation = informationToAccountOwner;
        }
    }
};

export default informationTag;
