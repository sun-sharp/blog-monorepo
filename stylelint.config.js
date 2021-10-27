module.exports = {
  root: true,
  plugins: ['stylelint-order', 'stylelint-scss'],
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ], // 禁止使用未知的伪类选择器
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ], // 禁止使用未知的伪元素
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend', 'apply', 'variants', 'responsive', 'screen', 'function', 'if', 'each', 'include', 'mixin'],
      },
    ], // 禁止使用未知的 at 规则
    'no-empty-source': null, // 禁止空源
    'named-grid-areas-no-invalid': null,
    'unicode-bom': 'never',
    'no-descending-specificity': null, // 禁止低优先级的选择器出现在高优先级的选择器之后。
    'font-family-no-missing-generic-family-keyword': null,
    'declaration-colon-space-after': 'always-single-line', // 在冒号之后要求有一个空格或禁止有空白
    'declaration-colon-space-before': 'never', // 在冒号之前要求有一个空格或禁止有空白
    'at-rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment'],
        except: ['first-nested'],
      },
    ],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports',
        },
        {
          type: 'at-rule',
          name: 'media',
        },
        'rules',
      ],
      { severity: 'warning' },
    ],
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};
