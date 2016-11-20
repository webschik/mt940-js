export function compareArrays (
    firstArray: Uint8Array|Buffer,
    firstArrayOffset: number,
    secondArray: Uint8Array|Buffer,
    secondArrayOffset: number,
    size: number
): boolean {
    for (let i = 0; i < size; i++) {
        if (firstArray[firstArrayOffset + i] !== secondArray[secondArrayOffset + i]) {
            return false;
        }
    }

    return true;
}