export default function compareArrays(
    firstArray: Uint8Array | Buffer,
    firstArrayOffset: number,
    secondArray: Uint8Array | Buffer,
    secondArrayOffset: number,
    length: number
): boolean {
    for (let i = 0; i < length; i++) {
        if (firstArray[firstArrayOffset + i] !== secondArray[secondArrayOffset + i]) {
            return false;
        }
    }

    return true;
}
