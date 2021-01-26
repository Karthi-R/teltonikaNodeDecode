function bufferFromBufferString(bufferStr) {
    return Buffer.from(
        bufferStr
            .replace(/[<>]/g, '') // remove < > symbols from str
            .split(' ') // create an array splitting it by space
            .slice(1) // remove Buffer word from an array
            .reduce((acc, val) =>
                acc.concat(parseInt(val, 16)), [])  // convert all strings of numbers to hex numbers
    )
}
module.exports = { bufferFromBufferString: bufferFromBufferString }