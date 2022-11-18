import type { App } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

export const setupMdEditor = (app: App<Element>) => {
  app.use(MdEditor);
};
