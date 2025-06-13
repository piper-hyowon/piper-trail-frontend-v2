export const renderMarkdown = (content: string) => {
    let renderedContent = content;

    renderedContent = renderedContent.split('\n').map(line => {
        if (line.startsWith('#### ')) return `<h4>${line.slice(5)}</h4>`;
        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
        if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
        return line;
    }).join('\n');

    renderedContent = renderedContent.replace(
        /```(\w*)\n([\s\S]*?)```/g,
        (match, lang, code) => {
            const trimmedCode = code.trim();
            return `<pre><code class="language-${lang || 'text'}">${trimmedCode
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')}</code></pre>`;
        }
    );

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
        /(\|.+\|[\r\n]+\|[\s\-:|]+\|[\r\n]+(\|.+\|[\r\n]*)+)/gm,
        (match) => renderTable(match)
    );

    renderedContent = renderedContent
        .replace(/^---+$/gm, '<hr />')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    renderedContent = renderedContent
        .split(/\n\n+/)  // 빈 줄로 나누기
        .map(paragraph => {
            // 이미 블록 요소인 경우
            if (paragraph.match(/^<(h[1-6]|pre|table|blockquote)/)) {
                return paragraph;
            }
            // 일반 텍스트는 <p>로 감싸기
            return `<p>${paragraph.replace(/\n/g, '<br />')}</p>`;
        })
        .join('\n');

    return renderedContent;
};