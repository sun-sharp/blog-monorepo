declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

declare module 'virtual:*' {
  const result: any;
  export default result;
}

// markdown 依赖
declare module 'prismjs';
declare module '@kangc/v-md-editor';
declare module '@kangc/v-md-editor/lib/theme/vuepress.js';
declare module '@kangc/v-md-editor/lib/theme/github.js';
declare module '@kangc/v-md-editor/lib/preview.js';
declare module '@kangc/v-md-editor/lib/lang/en-US';
declare module '@kangc/v-md-editor/lib/plugins/katex/cdn.js';
declare module '@kangc/v-md-editor/lib/plugins/mermaid/cdn.js';
declare module '@kangc/v-md-editor/lib/plugins/emoji/index';
declare module '@kangc/v-md-editor/lib/plugins/todo-list/index';
declare module '@kangc/v-md-editor/lib/plugins/copy-code/index';
