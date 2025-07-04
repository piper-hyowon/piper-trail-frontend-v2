const renderTable = (tableText: string) => {
    const lines = tableText.trim().split('\n');
    if (lines.length < 2) return tableText;

    let html = '<div class="table-wrapper"><table>';
    let inHeader = true;
    let hasHeaderSeparator = false;

    if (lines.length >= 2 && lines[1].match(/^\|[\s\-:|]+\|$/)) {
        hasHeaderSeparator = true;
    }

    lines.forEach((line, index) => {
        if (line.match(/^\|[\s\-:|]+\|$/)) {
            if (index === 1 && hasHeaderSeparator) {
                html += '</tr></thead><tbody>';
                inHeader = false;
            }
            return;
        }

        const cells = line
            .split('|')
            .slice(1, -1)
            .map(cell => cell.trim());

        if (cells.length === 0) return;

        if (index === 0 && hasHeaderSeparator) {
            html += '<thead><tr>';
            cells.forEach(cell => {
                const processedCell = cell
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                html += `<th>${processedCell}</th>`;
            });
            html += '</tr>';
        } else {
            if (!inHeader && index === 2 && hasHeaderSeparator) {
                html += '<tr>';
            } else if (!hasHeaderSeparator && index === 0) {
                html += '<tbody><tr>';
            } else {
                html += '<tr>';
            }

            cells.forEach(cell => {
                const processedCell = cell
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                html += `<td>${processedCell}</td>`;
            });
            html += '</tr>';
        }
    });

    if (!hasHeaderSeparator) {
        html += '</tbody>';
    } else if (inHeader) {
        html += '</thead></tbody>';
    } else {
        html += '</tbody>';
    }

    html += '</table></div>';
    return html;
};

export const renderMarkdown = (content: string) => {
    if (!content) return '';

    let renderedContent = content;

    const codeBlocks: string[] = [];
    renderedContent = renderedContent.replace(
        /```(\w*)\n([\s\S]*?)```/g,
        (match, lang, code) => {
            const placeholder = `___CODEBLOCK_${codeBlocks.length}___`;
            const trimmedCode = code.trim();
            codeBlocks.push(
                `<pre><code class="language-${lang || 'text'}">${trimmedCode
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')}</code></pre>`
            );
            return placeholder;
        }
    );

    const inlineCodes: string[] = [];
    renderedContent = renderedContent.replace(
        /`([^`\n]+)`/g,
        (match, code) => {
            const placeholder = `___INLINECODE_${inlineCodes.length}___`;
            inlineCodes.push(`<code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`);
            return placeholder;
        }
    );

    const tables: string[] = [];

    renderedContent = renderedContent.replace(
        /(\|[^\n]+\|)(\n\|[\s\-:|]+\|)(\n\|[^\n]+\|)*/g,
        (match) => {
            const lines = match.trim().split('\n');
            if (lines.length >= 2) {
                const placeholder = `___TABLE_${tables.length}___`;
                tables.push(renderTable(match));
                return placeholder;
            }
            return match;
        }
    );

    renderedContent = renderedContent.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text.trim()}</h${level}>`;
    });

    renderedContent = renderedContent.replace(/^---+$/gm, '<hr />');
    renderedContent = renderedContent.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    renderedContent = renderedContent.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    renderedContent = renderedContent.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
        return `<ul>${match}</ul>`;
    });

    renderedContent = renderedContent
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    const lines = renderedContent.split('\n');
    const processedLines: string[] = [];
    let inParagraph = false;
    let paragraphLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';

        if (trimmedLine.match(/^<[^>]+>|^___[A-Z]+_\d+___/)) {
            if (inParagraph && paragraphLines.length > 0) {
                processedLines.push(`<p>${paragraphLines.join('<br />')}</p>`);
                paragraphLines = [];
                inParagraph = false;
            }
            processedLines.push(line);
        } else if (trimmedLine === '') {
            if (inParagraph && paragraphLines.length > 0) {
                processedLines.push(`<p>${paragraphLines.join('<br />')}</p>`);
                paragraphLines = [];
                inParagraph = false;
            }
            if (processedLines.length > 0 && processedLines[processedLines.length - 1] !== '') {
                processedLines.push('');
            }
        } else {
            inParagraph = true;
            paragraphLines.push(line);
        }
    }

    if (inParagraph && paragraphLines.length > 0) {
        processedLines.push(`<p>${paragraphLines.join('<br />')}</p>`);
    }

    renderedContent = processedLines.join('\n');

    tables.forEach((table, index) => {
        renderedContent = renderedContent.replace(`___TABLE_${index}___`, table);
    });

    codeBlocks.forEach((code, index) => {
        renderedContent = renderedContent.replace(`___CODEBLOCK_${index}___`, code);
    });

    inlineCodes.forEach((code, index) => {
        renderedContent = renderedContent.replace(`___INLINECODE_${index}___`, code);
    });

    return renderedContent;
};