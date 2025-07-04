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

    const renderTable = (tableText: string) => {
        const lines = tableText.trim().split('\n').filter(line => line.trim());
        if (lines.length < 2) return tableText;

        let html = '<div class="table-wrapper"><table>';

        lines.forEach((line, index) => {
            if (line.match(/^\|[\s\-:|]+\|$/)) return;

            const cells = line.split('|')
                .map(cell => cell.trim())
                .filter((cell, idx, arr) => idx !== 0 && idx !== arr.length - 1);

            if (cells.length === 0) return;

            const tag = index === 0 ? 'th' : 'td';
            const rowTag = index === 0 ? 'thead' : 'tbody';

            if (index === 0) html += `<${rowTag}>`;
            html += '<tr>';

            cells.forEach(cell => {
                const processedCell = cell
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                html += `<${tag}>${processedCell}</${tag}>`;
            });

            html += '</tr>';
            if (index === 0) html += `</${rowTag}><tbody>`;
        });

        html += '</tbody></table></div>';
        return html;
    };

    renderedContent = renderedContent.replace(
        /^(\|[^\n]+\|)\n(\|[\s\-:|]+\|)\n((?:\|[^\n]+\|\n?)+)/gm,
        (match) => renderTable(match)
    );

    renderedContent = renderedContent.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text.trim()}</h${level}>`;
    });

    renderedContent = renderedContent
        .replace(/^---+$/gm, '<hr />')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    renderedContent = renderedContent.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

    renderedContent = renderedContent.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    renderedContent = renderedContent.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
        return `<ul>${match}</ul>`;
    });

    const blocks = renderedContent.split(/\n\n+/);
    renderedContent = blocks.map(block => {
        block = block.trim();

        if (block.match(/^<(h[1-6]|pre|table|blockquote|ul|ol|hr|div)/)) {
            return block;
        }

        if (block.match(/^___[A-Z]+_\d+___$/)) {
            return block;
        }

        return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    }).join('\n\n');

    codeBlocks.forEach((code, index) => {
        renderedContent = renderedContent.replace(`___CODEBLOCK_${index}___`, code);
    });

    inlineCodes.forEach((code, index) => {
        renderedContent = renderedContent.replace(`___INLINECODE_${index}___`, code);
    });

    return renderedContent;
};