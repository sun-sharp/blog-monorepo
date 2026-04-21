export default {
  plugins: {
    'postcss-pxtorem': {
      // 根字体大小，1rem = 16px
      rootValue: 16,
      // 转换精度，保留5位小数
      unitPrecision: 5,
      // 需要转换的属性，* 表示所有属性
      propList: ['*'],
      // 不排除任何选择器
      selectorBlackList: [],
      // 替换原始 px 值为 rem
      replace: true,
      // 不转换媒体查询中的 px 值
      mediaQuery: false,
      // 小于 2px 的值不转换（如 border: 1px）
      minPixelValue: 2,
    },
  },
};
