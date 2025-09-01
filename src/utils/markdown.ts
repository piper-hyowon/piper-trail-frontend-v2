import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';

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

                const encodedCode = btoa(unescape(encodeURIComponent(trimmedCode)));

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
                                    data-code="${encodedCode}"
                                    data-terminal-id="${terminalId}"
                                    onclick="window.runJavaScriptCode(${terminalId}, this.getAttribute('data-code'))">
                                ▶ Run
                            </button>
                        </div>
                        <div class="terminal-body" id="terminal-body-${terminalId}">
                            <div class="terminal-output" id="terminal-output-${terminalId}">
                                <div class="terminal-welcome">Ready to run JavaScript. Click "Run" to execute.</div>
                            </div>
                            <input type="text" class="terminal-input-field" id="terminal-input-${terminalId}" 
                                   style="display: none; background: transparent; border: none; color: white; width: 100%; outline: none; font-family: monospace;" />
                        </div>
                    </div>`
                );
            } else {
                // Prism.js로 하이라이팅
                let highlighted;
                try {
                    highlighted = Prism.highlight(
                        trimmedCode,
                        Prism.languages[language] || Prism.languages.plaintext,
                        language || 'plaintext'
                    );
                } catch (e) {
                    // 하이라이팅 실패 시 원본 사용
                    highlighted = trimmedCode
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                }

                // 고유 ID 생성
                const codeId = `code-${Date.now()}-${codeBlocks.length}`;

                codeBlocks.push(
                    `<div class="code-block-wrapper">
                        <div class="code-block-header">
                            <span class="code-language">${language || 'text'}</span>
                            <button class="code-copy-button" onclick="window.copyCode('${codeId}')">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                                </svg>
                                Copy
                            </button>
                        </div>
                        <pre class="language-${language}"><code id="${codeId}" class="language-${language}">${highlighted}</code></pre>
                    </div>`
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

    // 헤더
    renderedContent = renderedContent.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text.trim()}</h${level}>`;
    });

    // hr
    renderedContent = renderedContent.replace(/^---+$/gm, '<hr />');

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

            // 리스트 아이템이면 br 태그 추가하지 않음
            if (paragraph.includes('<ul>') || paragraph.includes('<ol>') ||
                paragraph.includes('</ul>') || paragraph.includes('</ol>')) {
                return paragraph;
            }

            return `<p>${paragraph.replace(/\n/g, '<br />')}</p>`;
        })
        .filter(p => p)
        .join('\n\n');

    // 리스트 처리 후 불필요한 br 태그 제거
    renderedContent = renderedContent.replace(/<\/li>\s*<br\s*\/?>/g, '</li>');
    renderedContent = renderedContent.replace(/<br\s*\/?>\s*<li>/g, '<li>');
    renderedContent = renderedContent.replace(/<\/ul>\s*<br\s*\/?>/g, '</ul>');
    renderedContent = renderedContent.replace(/<\/ol>\s*<br\s*\/?>/g, '</ol>');

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

            // 여기가 핵심: 모든 li 내용을 일관되게 처리
            // p 태그를 제거하거나 모든 항목에 p 태그 추가
            result.push(`<li>${content.replace(/<\/?p>/g, '')}</li>`);
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
        runJavaScriptCode: (terminalId: number, encodedCode: string) => void;
        copyCode: (codeId: string) => void;
    }
}

// 복사 함수
window.copyCode = (codeId: string) => {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;

    const code = codeElement.textContent || '';

    navigator.clipboard.writeText(code).then(() => {
        // 버튼 텍스트 변경
        const button = codeElement.closest('.code-block-wrapper')?.querySelector('.code-copy-button');
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                </svg>
                Copied!
            `;
            setTimeout(() => {
                button.innerHTML = originalHTML;
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
};

window.runJavaScriptCode = (terminalId: number, encodedCode: string) => {
    const outputDiv = document.getElementById(`terminal-output-${terminalId}`);
    const terminalBody = document.getElementById(`terminal-body-${terminalId}`);
    const inputField = document.getElementById(`terminal-input-${terminalId}`) as HTMLInputElement;
    const button = event?.target as HTMLButtonElement;

    if (!outputDiv || !terminalBody) return;

    // 버튼 상태 변경
    if (button) {
        button.disabled = true;
        button.textContent = '⚡ Running...';
    }

    // base64 디코딩
    let code: string;
    try {
        code = decodeURIComponent(escape(atob(encodedCode)));
    } catch (error) {
        outputDiv.innerHTML = `<div class="terminal-error">❌ Error: Failed to decode code</div>`;
        if (button) {
            button.disabled = false;
            button.textContent = '▶ Run';
        }
        return;
    }

    // 터미널 클리어
    outputDiv.innerHTML = `<div class="terminal-line">$ node script.js</div>`;

    // Console 메서드 오버라이드
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
    };

    // 출력 헬퍼
    const addOutput = (text: string, type: string = 'log') => {
        const className = type === 'error' ? 'terminal-error' : 'terminal-output-text';
        outputDiv.innerHTML += `<div class="${className}">${text}</div>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    // Console 메서드 재정의
    console.log = (...args: any[]) => {
        const text = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addOutput(text);
        originalConsole.log(...args);
    };

    console.error = (...args: any[]) => {
        const text = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addOutput(`❌ ${text}`, 'error');
        originalConsole.error(...args);
    };

    console.warn = (...args: any[]) => {
        const text = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addOutput(`⚠️ ${text}`, 'warn');
        originalConsole.warn(...args);
    };

    console.info = (...args: any[]) => {
        const text = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addOutput(`ℹ️ ${text}`, 'info');
        originalConsole.info(...args);
    };

    try {
        // 코드 실행
        const func = new Function(code);
        func();

        // runPigGame 함수가 정의되었는지 확인
        if (typeof (window as any).runPigGame === 'function') {
            (window as any).runPigGame(outputDiv, inputField);
        }

    } catch (error) {
        addOutput(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
        // Console 메서드 복원
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;

        // 버튼 상태 복원
        if (button) {
            button.disabled = false;
            button.textContent = '▶ Run';
        }
    }
};