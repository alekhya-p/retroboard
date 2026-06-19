// Tiny markdown renderer for AI-generated summaries and game text.
// Handles a safe subset: headings, bold, italic, inline code, bullets, and paragraphs.
// Inputs from the LLM are escaped before any HTML is emitted to keep this XSS-safe.

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  // Bold: **text** or __text__
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Italic: *text* or _text_ (avoid matching the inside of already-replaced bold tags)
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/(^|[^_])_([^_\n]+)_/g, '$1<em>$2</em>');
  // Inline code: `code`
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  return out;
}

export interface MdBlock {
  type: 'heading' | 'paragraph' | 'list';
  level?: number;
  html?: string;
  items?: string[];
}

export function parseMarkdown(input: string): MdBlock[] {
  if (!input) return [];
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const blocks: MdBlock[] = [];
  let listBuffer: string[] = [];
  let paraBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ type: 'list', items: listBuffer.map(renderInline) });
      listBuffer = [];
    }
  };
  const flushPara = () => {
    if (paraBuffer.length) {
      blocks.push({ type: 'paragraph', html: paraBuffer.map(renderInline).join('<br>') });
      paraBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      flushPara();
      continue;
    }
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      flushList();
      flushPara();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        html: renderInline(headingMatch[2]),
      });
      continue;
    }
    const bulletMatch = /^\s*(?:[-*•]|\d+[.)])\s+(.+)$/.exec(line);
    if (bulletMatch) {
      flushPara();
      listBuffer.push(bulletMatch[1]);
      continue;
    }
    flushList();
    paraBuffer.push(line);
  }
  flushList();
  flushPara();
  return blocks;
}
