import compareArrays from '../utils/compare-arrays';
import {colonSymbolCode, returnSymbolCode, newLineSymbolCode, spaceSymbolCode} from './../tokens';
import {Tag, State, Statement} from './../typings';

/**
 * @description :86:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 56, 54, colonSymbolCode]);
const tokenLength: number = token.length;
const informationTag: Tag = {
    multiline: true,

    readToken (state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    close (state: State) {
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

        statement.transactions[state.transactionIndex].description = String.fromCharCode.apply(
            String,
            description
        ).trim();
    }
};

export default informationTag;
