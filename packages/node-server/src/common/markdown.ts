import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { gfmHeadingId } from 'marked-gfm-heading-id'; // 新增
import hljs from 'highlight.js';
import * as jschardet from 'jschardet';
import * as iconv from 'iconv-lite';
import { logger } from './journal';

// 配置 markedHighlight
const markedWithHighlight = marked.use(
  markedHighlight({
    langPrefix: 'language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      try {
        return hljs.highlight(code, { language }).value;
      } catch (err) {
        logger.error(`高亮代码块 处理 失败! ${JSON.stringify(err)}`);
        // 错误处理
        return hljs.highlightAuto(code).value;
      }
    },
    async: true,
  }),
);

// 新增 gfmHeadingId 扩展
markedWithHighlight.use(
  gfmHeadingId({
    prefix: 'heading-', // 替代原来的 headerPrefix
  }),
);

// 移除 headerIds 和 headerPrefix 选项
markedWithHighlight.setOptions({
  gfm: true,
  breaks: false,
});

// MD → HTML（返回原始 HTML）
export async function markdownToHtml(mdText: string): Promise<string> {
  if (!mdText) return '';
  return (await markedWithHighlight.parse(mdText)) as string;
}

// 编码检测 + 转 UTF-8（复用 excel.ts 的模式）
export function decodeBuffer(buffer: Buffer): string {
  const detected = jschardet.detect(buffer);
  if (detected.encoding && detected.encoding.toLowerCase() !== 'utf-8' && iconv.encodingExists(detected.encoding)) {
    buffer = Buffer.from(iconv.decode(buffer, detected.encoding), 'utf-8');
  }
  return buffer.toString('utf-8');
}
