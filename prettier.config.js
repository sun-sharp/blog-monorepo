/*
 * @LastEditTime: 2023-08-01 10:52:33
 * @Description: prettier配置
 */

module.exports = {
  printWidth: 160, // 单行输出（不折行）的（最大）长度
  tabWidth: 2, // 每个缩进级别的空格数
  useTabs: false, // 不使用缩进符，而使用空格
  // useTabs: false, // 使用制表符 (tab) 缩进行而不是空格 (space)。
  semi: true, // 是否在语句末尾打印分号
  vueIndentScriptAndStyle: true, // 缩进Vue文件中的脚本和样式标签
  singleQuote: true, // 是否使用单引号
  quoteProps: 'as-needed', // 仅在需要时在对象属性周围添加引号
  bracketSpacing: true, // 是否在对象属性添加空格
  trailingComma: 'es5', // 添加es5中对象最末尾元素跟随的逗号
  jsxBracketSameLine: true, // 将 > 多行 JSX 元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭元素）,默认false,这里选择>不另起一行
  jsxSingleQuote: false, // jsx 不使用单引号，而使用双引号
  arrowParens: 'always', // 箭头函数，只有一个参数的时候，也需要括号
  insertPragma: false, // 取消在文件的顶部插入一个 @format的特殊注释，以表明改文件已经被Prettier格式化过了
  requirePragma: false, // 取消作为其第一注释的文件将被格式化
  proseWrap: 'always', // 当超出print width（上面有这个参数）时就折行
  htmlWhitespaceSensitivity: 'ignore', // 指定 HTML 文件的全局空白区域敏感度, "ignore" - 空格被认为是不敏感的
  endOfLine: 'crlf', // 换行符使用 crlf
  rangeStart: 0, // 每个文件格式化的范围是文件的全部内容
};
