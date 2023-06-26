export function getData(): any[] {
    var latinSentence =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.'
    var latinWords = latinSentence.split(' ')

    var rowData = []

    function generateRandomSentence(row: number, col: number) {
        var wordCount = ((row + 1) * (col + 1) * 733 * 19) % latinWords.length
        var parts = []
        for (var i = 0; i < wordCount; i++) {
            parts.push(latinWords[i])
        }
        var sentence = parts.join(' ')
        return sentence + '.'
    }

    // create 100 rows
    for (var i = 0; i < 100; i++) {
        var item = {
            rowNumber: 'Row ' + i,
            autoA: generateRandomSentence(i, 1),
            autoB: generateRandomSentence(i, 2),
            autoC: generateRandomSentence(i, 3),
        }
        rowData.push(item)
    }

    return rowData
}