import Turndown from 'turndown';

/**
 * @description: 表格列处理
 */
const tableCell = (content: string, node: Turndown.Node) => {
  const index = Array.prototype.indexOf.call(node?.parentNode?.childNodes, node);
  let prefix = ' ';
  if (index === 0) prefix = '| ';
  return prefix + content.replace(/\n/g, '<br>') + ' |';
};

const isFirstTbody = (element: ParentNode) => {
  const previousSibling = element.previousSibling;
  return element.nodeName === 'TBODY' && (!previousSibling || (previousSibling.nodeName === 'THEAD' && /^\s*$/i.test(previousSibling.textContent || '')));
};

const isHeadingRow = (tr: Turndown.Node) => {
  const parentNode = tr.parentNode || ({} as ParentNode);
  return (
    parentNode.nodeName === 'THEAD' ||
    (parentNode.firstChild === tr &&
      (parentNode.nodeName === 'TABLE' || isFirstTbody(parentNode)) &&
      Array.prototype.every.call(tr.childNodes, function (n) {
        return n.nodeName === 'TH';
      }))
  );
};

/**
 * @description: 处理html需保持不变的字段
 */
const formatTurndownKeep = (turndownService: Turndown) => {
  // 表格
  turndownService.keep((node) => {
    // @ts-ignore
    return node.nodeName === 'TABLE' && !isHeadingRow(node.rows[0]);
  });
};

/**
 * @description: 处理特殊html转化规则
 */
const formatTurndownRules = (turndownService: Turndown) => {
  const rules: { [key: string]: Turndown.Rule } = {};
  // strikethrough
  rules.strikethrough = {
    filter: ['del', 's'],
    replacement: (content) => {
      return '~' + content + '~';
    },
  };
  // 表格
  rules.tableCell = {
    filter: ['th', 'td'],
    replacement: (content, node) => {
      return tableCell(content, node);
    },
  };
  rules.tableRow = {
    filter: 'tr',
    replacement: (content, node) => {
      let borderCells = '';
      const alignMap = { left: ':--', right: '--:', center: ':-:' };

      if (isHeadingRow(node)) {
        for (let i = 0; i < node.childNodes.length; i++) {
          let border = '---';
          // @ts-ignore
          const align = (node.childNodes[i].getAttribute('align') || '').toLowerCase();
          // @ts-ignore
          if (align) border = alignMap[align] || border;
          // @ts-ignore
          borderCells += tableCell(border, node.childNodes[i]);
        }
      }
      return '\n' + content + (borderCells ? '\n' + borderCells : '');
    },
  };
  rules.table = {
    filter: (node) => {
      // @ts-ignore
      return node.nodeName === 'TABLE' && isHeadingRow(node.rows[0]);
    },

    replacement: function (content) {
      content = content.replace('\n\n', '\n');
      return '\n\n' + content + '\n\n';
    },
  };
  rules.tableSection = {
    filter: ['thead', 'tbody', 'tfoot'],
    replacement: function (content) {
      return content;
    },
  };
  for (const key in rules) turndownService.addRule(key, rules[key]);
};

/**
 * @description: 初始化turndown方法
 */
export const initTurndownService = () => {
  const turndownService = new Turndown({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    hr: '- - -',
    linkStyle: 'inlined',
  });
  formatTurndownKeep(turndownService);
  formatTurndownRules(turndownService);

  return turndownService;
};
