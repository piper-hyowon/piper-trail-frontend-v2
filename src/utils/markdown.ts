export const renderMarkdown = (content: string) => {
    if (!content) return '';

    let renderedContent = content;

    // 1. 코드 블록
    const codeBlocks: string[] = [];
    renderedContent = renderedContent.replace(
        /```(\w*)([\r\n\s])([\s\S]*?)```/g,
        (match, lang, separator, code) => {
            const placeholder = `%%CODEBLOCK${codeBlocks.length}%%`;
            const trimmedCode = code.trim();
            codeBlocks.push(
                `<pre><code class="language-${lang || 'text'}">${trimmedCode
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')}</code></pre>`
            );
            return placeholder;
        }
    );

    // 2. 인라인 코드
    const inlineCodes: string[] = [];
    renderedContent = renderedContent.replace(
        /`([^`\n]+)`/g,
        (match, code) => {
            const placeholder = `%%INLINECODE${inlineCodes.length}%%`;
            inlineCodes.push(`<code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`);
            return placeholder;
        }
    );

    // Bold/Italic 먼저 (리스트보다)
    // Bold + Italic
    renderedContent = renderedContent.replace(/\*\*\*([^*]+)\*\*\*/g, '%%BOLDITALIC%%$1%%ENDBOLDITALIC%%');
    // Bold
    renderedContent = renderedContent.replace(/\*\*([^*]+)\*\*/g, '%%BOLD%%$1%%ENDBOLD%%');
    renderedContent = renderedContent.replace(/__([^_]+)__/g, '%%BOLD%%$1%%ENDBOLD%%');
    // Italic
    renderedContent = renderedContent.replace(/(?<!\*)\*(?!\*)([^*\n]+)\*(?!\*)/g, '%%ITALIC%%$1%%ENDITALIC%%');
    renderedContent = renderedContent.replace(/(?<!_)_(?!_)([^_\n]+)_(?!_)/g, '%%ITALIC%%$1%%ENDITALIC%%');

    // 이미지
    renderedContent = renderedContent.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" />'
    );

    // 링크
    renderedContent = renderedContent.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>'
    );

    // 테이블
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

    // 인용문
    const blockquotes: string[] = [];
    renderedContent = renderedContent.replace(
        /^(>+)(.*)$/gm,
        (match, arrows, content) => {
            const level = arrows.length;
            const placeholder = `%%BLOCKQUOTE${blockquotes.length}%%`;
            blockquotes.push(`<blockquote>${content.trim()}</blockquote>`);
            return placeholder;
        }
    );

    // 인용문 병합
    renderedContent = renderedContent.replace(
        /(%%BLOCKQUOTE\d+%%\n?)+/g,
        (match) => {
            const quotes = match.trim().split('\n').map(line => {
                const index = parseInt(line.match(/%%BLOCKQUOTE(\d+)%%/)?.[1] || '0');
                return blockquotes[index].replace(/<\/?blockquote>/g, '');
            });
            return `<blockquote>${quotes.join('<br>')}</blockquote>`;
        }
    );

    renderedContent = renderedContent.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text.trim()}</h${level}>`;
    });

    // hr
    renderedContent = renderedContent.replace(/^---+$/gm, '<hr />');

    // 리스트
    renderedContent = renderedContent.replace(
        /^(\s*)[-*+]\s+(.+)$/gm,
        (match, indent, content) => {
            const level = Math.floor(indent.length / 2);
            return `<ul_item level="${level}">${content}</ul_item>`;
        }
    );

    renderedContent = renderedContent.replace(
        /^(\s*)\d+\.\s+(.+)$/gm,
        (match, indent, content) => {
            const level = Math.floor(indent.length / 2);
            return `<ol_item level="${level}">${content}</ol_item>`;
        }
    );

    renderedContent = processLists(renderedContent);

    // 취소선, 위첨자, 아래첨자
    renderedContent = renderedContent.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    renderedContent = renderedContent.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
    renderedContent = renderedContent.replace(/~\{([^}]+)\}/g, '<sub>$1</sub>');

    // 단락
    renderedContent = renderedContent
        .split(/\n\n+/)
        .map(paragraph => {
            paragraph = paragraph.trim();

            if (paragraph.match(/^<(h[1-6]|pre|table|hr|blockquote|ul|ol)|^%%[A-Z]+\d+%%/)) {
                return paragraph;
            }

            if (!paragraph) return '';

            return `<p>${paragraph.replace(/\n/g, '<br />')}</p>`;
        })
        .filter(p => p)
        .join('\n\n');

    renderedContent = renderedContent.replace(/%%BOLDITALIC%%(.+?)%%ENDBOLDITALIC%%/g, '<strong><em>$1</em></strong>');
    renderedContent = renderedContent.replace(/%%BOLD%%(.+?)%%ENDBOLD%%/g, '<strong>$1</strong>');
    renderedContent = renderedContent.replace(/%%ITALIC%%(.+?)%%ENDITALIC%%/g, '<em>$1</em>');

    blockquotes.forEach((quote, index) => {
        const placeholder = `%%BLOCKQUOTE${index}%%`;
        if (renderedContent.includes(placeholder)) {
            renderedContent = renderedContent.replace(placeholder, quote);
        }
    });

    codeBlocks.forEach((code, index) => {
        renderedContent = renderedContent.replace(`%%CODEBLOCK${index}%%`, code);
    });

    inlineCodes.forEach((code, index) => {
        renderedContent = renderedContent.replace(`%%INLINECODE${index}%%`, code);
    });

    // 이미지 lazy loading
    renderedContent = renderedContent.replace(/<img/g, '<img loading="lazy"');

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