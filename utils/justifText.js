function justifyText(text, lineWidth = 80) {
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        if (currentLine.length + words[i].length + 1 > lineWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine += ' ' + words[i];
        }
    }

    lines.push(currentLine);

    // Justify the lines by adding spaces
    for (let i = 0; i < lines.length - 1; i++) { // exclude the last line from justification
        lines[i] = adjustLine(lines[i], lineWidth);
    }

    return lines.join('\n');
}

function adjustLine(line, lineWidth) {
    while (line.length < lineWidth) {
        for (let i = 0; i < line.length - 1 && line.length < lineWidth; i++) {
            if (line[i] === ' ' && line[i + 1] !== ' ') {
                line = insertAt(line, i + 1, ' ');
                while (i < line.length - 1 && line[i] !== ' ') {
                    i++;
                }
            }
        }
    }
    return line;
}

function insertAt(original, index, string) {
    return original.slice(0, index) + string + original.slice(index);
}

module.exports = {
    justifyText
};