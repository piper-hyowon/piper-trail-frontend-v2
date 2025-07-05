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

    renderedContent = renderedContent.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" />'
    );

    renderedContent = renderedContent.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>'
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
                html += `<${tag}>${renderInlineElements(cell.trim())}</${tag}>`;
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

    const blockquotes: string[] = [];
    renderedContent = renderedContent.replace(
        /^(>+)(.*)$/gm,
        (match, arrows, content) => {
            const level = arrows.length;
            const placeholder = `___BLOCKQUOTE_${blockquotes.length}___`;
            blockquotes.push(`<blockquote>${content.trim()}</blockquote>`);
            return placeholder;
        }
    );

    renderedContent = renderedContent.replace(
        /(___BLOCKQUOTE_\d+___\n?)+/g,
        (match) => {
            const quotes = match.trim().split('\n').map(line => {
                const index = parseInt(line.match(/___BLOCKQUOTE_(\d+)___/)?.[1] || '0');
                return blockquotes[index].replace(/<\/?blockquote>/g, '');
            });
            return `<blockquote>${quotes.join('<br>')}</blockquote>`;
        }
    );

    renderedContent = renderedContent.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        const cleanText = renderInlineElements(text.trim());
        return `<h${level}>${cleanText}</h${level}>`;
    });

    renderedContent = renderedContent.replace(/^---+$/gm, '<hr />');

    renderedContent = renderedContent.replace(
        /^(\s*)[-*+]\s+(.+)$/gm,
        (match, indent, content) => {
            const level = Math.floor(indent.length / 2);
            return `<ul_item level="${level}">${renderInlineElements(content)}</ul_item>`;
        }
    );

    renderedContent = renderedContent.replace(
        /^(\s*)\d+\.\s+(.+)$/gm,
        (match, indent, content) => {
            const level = Math.floor(indent.length / 2);
            return `<ol_item level="${level}">${renderInlineElements(content)}</ol_item>`;
        }
    );

    renderedContent = processLists(renderedContent);

    function renderInlineElements(text: string): string {
        return text
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
            .replace(/~\{([^}]+)\}/g, '<sub>$1</sub>');
    }

    renderedContent = renderedContent
        .split(/\n\n+/)
        .map(paragraph => {
            paragraph = paragraph.trim();

            if (paragraph.match(/^<(h[1-6]|pre|table|hr|blockquote|ul|ol)|^___[A-Z]+_\d+___/)) {
                return paragraph;
            }

            if (!paragraph) return '';

            return `<p>${renderInlineElements(paragraph).replace(/\n/g, '<br />')}</p>`;
        })
        .filter(p => p) // 빈 요소 제거
        .join('\n\n');

    blockquotes.forEach((quote, index) => {
        const placeholder = `___BLOCKQUOTE_${index}___`;
        if (renderedContent.includes(placeholder)) {
            renderedContent = renderedContent.replace(placeholder, quote);
        }
    });

    codeBlocks.forEach((code, index) => {
        renderedContent = renderedContent.replace(`___CODEBLOCK_${index}___`, code);
    });

    inlineCodes.forEach((code, index) => {
        renderedContent = renderedContent.replace(`___INLINECODE_${index}___`, code);
    });

    return renderedContent;
};

function processLists(content: string): string {
    const lines = content.split('\n');
    const result: string[] = [];
    let currentList: { type: 'ul' | 'ol', level: number } | null = null;
    let openLists: Array<{ type: 'ul' | 'ol', level: number }> = [];

    for (const line of lines) {
        const ulMatch = line.match(/^<ul_item level="(\d+)">(.+)<\/ul_item>$/);
        const olMatch = line.match(/^<ol_item level="(\d+)">(.+)<\/ol_item>$/);

        if (ulMatch || olMatch) {
            const [, levelStr, content] = ulMatch || olMatch || [];
            const level = parseInt(levelStr);
            const type = ulMatch ? 'ul' : 'ol';

            while (openLists.length < level + 1) {
                result.push(`<${type}>`);
                openLists.push({type, level: openLists.length});
            }

            while (openLists.length > level + 1) {
                const list = openLists.pop();
                if (list) result.push(`</${list.type}>`);
            }

            if (openLists[level] && openLists[level].type !== type) {
                result.push(`</${openLists[level].type}>`);
                result.push(`<${type}>`);
                openLists[level] = {type, level};
            }

            result.push(`<li>${content}</li>`);
        } else {
            while (openLists.length > 0) {
                const list = openLists.pop();
                if (list) result.push(`</${list.type}>`);
            }
            result.push(line);
        }
    }

    while (openLists.length > 0) {
        const list = openLists.pop();
        if (list) result.push(`</${list.type}>`);
    }

    return result.join('\n');
}