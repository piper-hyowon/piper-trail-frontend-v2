export const renderMarkdown = (content: string) => {
    if (!content) return '';

    let renderedContent = content;

    const codeBlocks: string[] = [];
    renderedContent = renderedContent.replace(
        /```(\w*)([\r\n\s])([\s\S]*?)```/g,
        (match, lang, separator, code) => {
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

    // 표 처리
    const renderTable = (tableText: string) => {
        const lines = tableText.trim().split('\n');
        if (lines.length < 2) return tableText;

        let html = '<table>';
        lines.forEach((line, index) => {
            if (index === 1 && line.match(/^\|[\s\-:|]+\|$/)) return;
            const cells = line.split('|').slice(1, -1);
            const tag = index === 0 ? 'th' : 'td';
            html += '<tr>';
            cells.forEach(cell => {
                html += `<${tag}>${cell.trim()}</${tag}>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        return html;
    };

    renderedContent = renderedContent.replace(
        /(\|.+\|\s*\n\|[\s\-:|]+\|\s*\n(\|.+\|\s*\n?)+)/gm,
        (match) => renderTable(match)
    );

    // 헤더 처리
    renderedContent = renderedContent.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text.trim()}</h${level}>`;
    });

    renderedContent = renderedContent
        .replace(/^---+$/gm, '<hr />')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // 문단
    renderedContent = renderedContent
        .split(/\n\n+/)
        .map(paragraph => {
            if (paragraph.match(/^<(h[1-6]|pre|table|hr|blockquote)|^___[A-Z]+_\d+___/)) {
                return paragraph;
            }
            return `<p>${paragraph.replace(/\n/g, '<br />')}</p>`;
        })
        .join('\n');

    codeBlocks.forEach((code, index) => {
        renderedContent = renderedContent.replace(`___CODEBLOCK_${index}___`, code);
    });

    inlineCodes.forEach((code, index) => {
        renderedContent = renderedContent.replace(`___INLINECODE_${index}___`, code);
    });

    return renderedContent;
};