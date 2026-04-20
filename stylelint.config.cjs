/*
 * @Author: YangRuiRui
 * @LastEditTime: 2026-04-20 17:03:50
 * @Description: stylelint配置文件
 *
 * stylelint ---- 主依赖
 * stylelint-config-recommended ---- 推荐的规则集
 * stylelint-config-recommended-scss ---- 针对scss的标准可共享配置
 * stylelint-config-rational-order ---- CSS属性排序规则
 * stylelint-scss ---- SCSS语法支持
 * stylelint-no-unsupported-browser-features ---- 浏览器兼容性检查
 */

module.exports = {
  root: true,
  plugins: ['stylelint-scss', 'stylelint-no-unsupported-browser-features'],
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-recommended-scss',
    'stylelint-config-rational-order'
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'use', 'mixin', 'include', 'for', 'if', 'else', 'function', 'return',
          'tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer',
          'import', 'forward', 'content', 'debug', 'warn', 'error'
        ]
      }
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'use', 'mixin', 'include', 'for', 'if', 'else', 'function', 'return',
          'tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer',
          'import', 'forward', 'content', 'debug', 'warn', 'error'
        ]
      }
    ],
    'no-descending-specificity': null,
    'no-empty-source': null,
    'font-family-no-missing-generic-family-keyword': [true, { ignoreFontFamilies: ['iconfont'] }],
    'declaration-block-single-line-max-declarations': null,
    'plugin/no-unsupported-browser-features': [true, {
      browsers: ['last 2 versions', 'not dead', 'not ie 11', 'not op_mini all'],
      ignore: [
        'rem', 'css-gradients', 'css-masks', 'css3-boxsizing', 'css3-tabsize',
        'css-rrggbbaa', 'css-media-range-syntax', 'css-nesting', 'mdn-text-decoration-shorthand',
        'viewport-units', 'css-animation', 'css-transitions', 'css-boxshadow', 'transforms2d',
        'css-variables', 'flexbox', 'css-fixed', 'calc', 'intrinsic-width', 'css-sticky',
        'css-logical-props', 'transforms3d', 'css-overflow'
      ],
      severity: 'warning'
    }]
  },
  overrides: [
    {
      files: ['**/*.scss', '**/*.sass'],
      customSyntax: 'postcss-scss',
      rules: {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true
      }
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less'
    },
    {
      files: ['**/*.html', '**/*.vue'],
      customSyntax: 'postcss-html'
    }
  ]
};
