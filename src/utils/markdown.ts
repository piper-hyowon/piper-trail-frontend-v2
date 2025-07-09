export const renderMarkdown = (content: string) => {
    if (!content) return '';

    let renderedContent = content;
    let terminalId = 0;

    // 1. 코드 블록
    const codeBlocks: string[] = [];
    renderedContent = renderedContent.replace(
        /```(\w+(?:-run)?)([\r\n\s])([\s\S]*?)```/g,
        (match, langTag, separator, code) => {
            const placeholder = `%%CODEBLOCK${codeBlocks.length}%%`;
            const trimmedCode = code.trim();

            // 실행 가능 여부 확인
            const isExecutable = langTag.endsWith('-run');
            const language = langTag.replace('-run', '');

            if (isExecutable && (language === 'js' || language === 'javascript')) {
                // JavaScript 터미널 UI 생성
                terminalId++;
                codeBlocks.push(
                    `<div class="terminal-container" id="terminal-${terminalId}">
                        <div class="terminal-header">
                            <div class="terminal-buttons">
                                <span class="terminal-button close"></span>
                                <span class="terminal-button minimize"></span>
                                <span class="terminal-button maximize"></span>
                            </div>
                            <div class="terminal-title">JavaScript Console</div>
                            <button class="terminal-run-button" 
                                    onclick="window.runJavaScriptCode(${terminalId}, \`${trimmedCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">
                                ▶ Run
                            </button>
                        </div>
                        <div class="terminal-body" id="terminal-body-${terminalId}">
                            <div class="terminal-output" id="terminal-output-${terminalId}">
                                <div class="terminal-welcome">Ready to run JavaScript. Click "Run" to execute.</div>
                            </div>
                        </div>
                    </div>`
                );
            } else {
                // 일반 코드 블록
                codeBlocks.push(
                    `<pre><code class="language-${language || 'text'}">${trimmedCode
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')}</code></pre>`
                );
            }
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

declare global {
    interface Window {
        runJavaScriptCode: (terminalId: number, code: string) => void;
    }
}

window.runJavaScriptCode = (terminalId: number, code: string) => {
    const outputDiv = document.getElementById(`terminal-output-${terminalId}`);
    const terminalBody = document.getElementById(`terminal-body-${terminalId}`);
    const button = event?.target as HTMLButtonElement;

    if (!outputDiv || !terminalBody) return;

    // 버튼 상태 변경
    if (button) {
        button.disabled = true;
        button.textContent = '⚡ Running...';
    }

    // 터미널 클리어
    outputDiv.innerHTML = `<div class="terminal-line">$ node script.js</div>`;

    // 입력 필드 추가
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'terminal-input-field';
    inputField.style.cssText = 'display: none; background: transparent; border: none; color: white; width: 100%; outline: none; font-family: monospace;';
    terminalBody.appendChild(inputField);

    const logs: string[] = [];
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
    };

    // 출력 헬퍼
    const addOutput = (text: string) => {
        outputDiv.innerHTML += `<div class="terminal-output-text">${text}</div>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    console.log = (...args: any[]) => {
        const text = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addOutput(text);
    };

    console.error = (...args: any[]) => {
        addOutput(`<span style="color: #f48771;">❌ ${args.join(' ')}</span>`);
    };

    console.warn = (...args: any[]) => {
        addOutput(`<span style="color: #ffbd2e;">⚠️ ${args.join(' ')}</span>`);
    };

    console.info = (...args: any[]) => {
        addOutput(`<span style="color: #4ec9b0;">ℹ️ ${args.join(' ')}</span>`);
    };

    try {
        const func = new Function(code);
        func();

        if (typeof (window as any).runPigGame === 'function') {
            (window as any).runPigGame(outputDiv, inputField);
        }

    } catch (error) {
        outputDiv.innerHTML += `<div class="terminal-error">❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    } finally {
    }
};