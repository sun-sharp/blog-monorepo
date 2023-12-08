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

const htmlText = `<table>
<thead>
<tr>
<th>特点</th>
<th>VUE</th>
<th>React</th>
</tr>
</thead>
<tbody>
<tr>
<td>组件引用</td>
<td>分为全局注册和局部注册。</td>
<td>通过import相应组件，然后模版中引用。</td>
</tr>
<tr>
<td>数据流</td>
<td>1.父组件通过传递props来更新子组件视图，显示地调用props选项来声明它期待获得的数据。<br> 2.vue是数据可变的，双向绑定，声明式的写法，vue组件的横向拆分很多情况下用mixin。</td>
<td>1.官方建议props要像纯函数那样，输入输出一致对应，而且不太建议通过props来更改视图。<br> 2.react是整体的思路的就是函数式，所以推崇纯组件，数据不可变，单向数据流，当然需要双向的地方也可以做到，比如结合redux-form，组件的横向拆分一般是通过高阶组件。</td>
</tr>
<tr>
<td>模版</td>
<td>有自己的vue文件</td>
<td>jsx语法</td>
</tr>
<tr>
<td>状态管理</td>
<td>1.state对象并不是必须的，数据由data属性在Vue对象中进行管理。<br>2.非父子组件之间嵌套过深的时候状态管理可引用vuex。</td>
<td>1.在react中是关键的概念，它是不可变的，在React中你需要使用setState()方法去更新状态。<br>2.非父子组件之间嵌套过深的时候状态管理可引用react-redux。</td>
</tr>
<tr>
<td>事件</td>
<td>1.每个Vue实例都实现了事件接口，方便父子组件通信，小型项目中不需要引入状态管理机制。<br>2.Vue增加的语法糖computed和watch</td>
<td>1.必须自己实现事件。<br>2.只能使用JSX语法写一套逻辑来实现。</td>
</tr>
<tr>
<td>状态管理</td>
<td>1.state对象并不是必须的，数据由data属性在Vue对象中进行管理。<br>2.非父子组件之间嵌套过深的时候状态管理可引用vuex。</td>
<td>1.在react中是关键的概念，它是不可变的，在React中你需要使用setState()方法去更新状态。<br>2.非父子组件之间嵌套过深的时候状态管理可引用react-redux。</td>
</tr>
<tr>
<td>维护</td>
<td>由google前员工尤雨溪个人维护。</td>
<td>由facebook维护。</td>
</tr>
<tr>
<td>学习曲线</td>
<td>学习曲线平缓，内部封装很多语法糖</td>
<td>学习曲线稍复杂，更灵活</td>
</tr>
<tr>
<td>使用场景</td>
<td>1.高级web单页面；<br>2.APP混合开发（阿里开源weex）；<br>3.微信小程序开发（美团开源mpvue、网易考拉开源megalo）；<br>4.结合electron开发桌面程序。</td>
<td>1.高级web页面；<br>2.APP混合开发（facebook开源react-native）；<br>3.微信小程序（京东开源taro）；<br>4.可结合electron开发桌面程序。</td>
</tr>
<tr>
<td>UI生态</td>
<td>1.pc端：iview、element等；<br>2.h5端：有赞vant、mintui等；<br>3.混合开发：weexui，bui-weex；<br>4.微信小程序：iView Weapp、zanui；</td>
<td>1.pc端：Ant Design、Material-UI等；<br>2.h5端：Ant Design Mobile、weui等；<br>3.混合开发：teaset，react-native-elements；<br>4.微信小程序：iView Weapp、Taro UI；</td>
</tr>
</tbody>
</table>`;
const turndownService = initTurndownService();
const mdText = turndownService.turndown(htmlText);

console.log(mdText, 'mdText');
