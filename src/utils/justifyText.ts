function justifyText(text: string, lineWidth: number = 80) {
    const words: string[] = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine: string = words[0];

    for (let i = 1; i < words.length; i++) {
        if (currentLine.length + words[i].length + 1 > lineWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine += ' ' + words[i];
        }
    }

    lines.push(currentLine);

    // Add extra spaces to each line
    for (let i = 0; i < lines.length; i++) {
        let spacesToAdd: number = lineWidth - lines[i].length;
        const spacePositions: number[] = [];

        // Avoid adding spaces to the last line
        if (i === lines.length - 1) {
            break;
        }

        // Detect space positions
        for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] === ' ') {
                spacePositions.push(j);
            }
        }

        // Distribute extra spaces
        while (spacesToAdd > 0) {
            for (let j = 0; j < spacePositions.length && spacesToAdd > 0; j++, spacesToAdd--) {
                lines[i] = insertAt(lines[i], spacePositions[j], ' ');
                for (let k = j + 1; k < spacePositions.length; k++) {
                    spacePositions[k]++;
                }
            }
        }
    }

    return lines.join('\n');
}

function insertAt(original: string, index: number, string: string): string {
    return original.slice(0, index) + string + original.slice(index);
}

export { justifyText };