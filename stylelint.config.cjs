/*
 * @Author: YangRuiRui
 * @LastEditTime: 2026-04-20 15:56:21
 * @Description: stylelint验证代码
 *
 * stylelint ---- 主依赖
 * stylelint-config-rational-order ---- 针对css属性排序的共享规则配置，避免长串css属性顺序规则书写。与stylelint-order配合使用
 * stylelint-config-standard-scss ---- 针对scss的标准可共享配置。与stylelint-scss配合使用
 stylelint-config-standard-vue ---- 为 Stylelint 推荐的标准可共享 Vue 配置。
 * stylelint-no-unsupported-browser-features ---- 禁止您所针对的浏览器不支持的 CSS。
 *
 *
 warning "stylelint-config-standard-scss > stylelint-config-recommended-scss > postcss-scss@4.0.6" has unmet peer dependency "postcss@^8.4.19".
 warning " > stylelint-config-standard-vue@1.0.0" has unmet peer dependency "postcss-html@^1.0.0".
 warning "stylelint-config-standard-vue > stylelint-config-html@1.1.0" has unmet peer dependency "postcss-html@^1.0.0".
 warning "stylelint-config-standard-vue > stylelint-config-recommended-vue@1.4.0" has unmet peer dependency "postcss-html@^1.0.0"
 * 
 * 自定义语法
 * postcss ---- 用于postcss-html和postcss-scss的支持
 * postcss-scss ---- 解析<style lang=“scss”>下的scss样式
 * postcss-html ---- 解析<style>类 vue、html 文件标签中的样式
 */

module.exports = {
  root: true,
  extends: [
    'stylelint-config-rational-order',
    'stylelint-config-standard-scss', //
    'stylelint-config-standard-scss',
  ],
  plugins: ['stylelint-no-unsupported-browser-features'],
  customSyntax: 'postcss-html',
  overrides: [
    {
      files: ['**/*.{scss,css,sass}'], // css 相关文件由 postcss-scss 处理
      customSyntax: 'postcss-scss',
    },
  ],
  rules: {
    'no-empty-source': null, // 允许空文件
    'no-descending-specificity': null, // 禁止低优先级的选择器出现在高优先级的选择器之后
    // 'font-family-name-quotes': null, // 允许在字体系列中缺少通用系列关键字
    // 'font-family-no-missing-generic-family-keyword': [
    //   true,
    //   {
    //     ignoreFontFamilies: ['iconfont'],
    //   },
    // ],
    "declaration-block-single-line-max-declarations": null,
    "no-duplicate-selectors": null,
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "no-unsupported-browser-features": null
  },
};
