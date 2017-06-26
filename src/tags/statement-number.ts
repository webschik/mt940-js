import compareArrays from '../utils/compare-arrays';
import {colonSymbolCode, slashSymbolCode} from './../tokens';
import {Tag, State} from './../index';

/**
 * @description :28:
 * @type {Uint8Array}
 */
const token1: Uint8Array = new Uint8Array([colonSymbolCode, 50, 56, colonSymbolCode]);

/**
 * @description :28C:
 * @type {Uint8Array}
 */
const token2: Uint8Array = new Uint8Array([colonSymbolCode, 50, 56, 67, colonSymbolCode]);
const token1Length: number = token1.length;
const token2Length: number = token2.length;
const statementNumberTag: Tag = {
    readToken (state: State) {
        const isToken1: boolean = compareArrays(token1, 0, state.data, state.pos, token1Length);
        const isToken2: boolean = !isToken1 && compareArrays(token2, 0, state.data, state.pos, token2Length);

        if (!isToken1 && !isToken2) {
            return 0;
        }

        this.slashPos = 0;
        return state.pos + (isToken1 ? token1Length : token2Length);
    },

    readContent (state: State, symbolCode: number) {
        if (symbolCode === slashSymbolCode) {
            this.slashPos = state.pos;
        }
    },

    close (state: State) {
        state.statements[state.statementIndex].number = String.fromCharCode.apply(
            String,
            state.data.slice(state.tagContentStart, this.slashPos || state.tagContentEnd)
        );
    }
};

export default statementNumberTag;