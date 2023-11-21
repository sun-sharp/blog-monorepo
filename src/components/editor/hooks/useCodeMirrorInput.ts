import { ExtractPropTypes } from 'vue';
import type { CSSProperties } from 'vue';
import { EditorState, EditorStateConfig, Compartment, Extension, StateEffect } from '@codemirror/state';
import { EditorView, EditorViewConfig, keymap, placeholder } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { indentUnit } from '@codemirror/language';
import { CreateStateOptions, EditorTools } from '/#/components/editor';

const UNDEFINED = false;
const NonDefaultBooleanType = {
  type: Boolean,
  default: UNDEFINED,
};

export const configProps = {
  autofocus: NonDefaultBooleanType,
  disabled: NonDefaultBooleanType,
  indentWithTab: NonDefaultBooleanType,
  tabSize: Number,
  placeholder: String,
  style: Object as PropType<CSSProperties>,
  autoDestroy: NonDefaultBooleanType,
  phrases: Object as PropType<Record<string, string>>,
  // codemirror options
  root: Object as PropType<ShadowRoot | Document>,
  languageType: {
    validator(value: string) {
      return ['javaScript', 'html', 'css', 'sass', 'less', 'json', 'markdown', 'vue', 'python'].includes(value);
    },
    default: 'javaScript',
  },
  // extensions: Array as PropType<EditorStateConfig['extensions']>,
  selection: Object as PropType<EditorStateConfig['selection']>,
};

export const modelValueProp = {
  modelValue: {
    type: String,
    default: '',
  },
};

export const CodeMirrorInputProps = {
  ...configProps,
  ...modelValueProp,
};

export type ConfigProps = ExtractPropTypes<typeof configProps>;

// 默认配置
export const DEFAULT_CONFIG: Readonly<Partial<ConfigProps>> = Object.freeze({
  autofocus: false,
  disabled: false,
  indentWithTab: true,
  tabSize: 2,
  placeholder: '',
  autoDestroy: true,
});

// 装机编辑器状态
export const createEditorState = ({ onUpdate, onChange, onFocus, onBlur, ...config }: CreateStateOptions) => {
  return EditorState.create({
    doc: config.doc,
    selection: config.selection,
    extensions: [
      ...(Array.isArray(config.extensions) ? config.extensions : [config.extensions]),
      EditorView.updateListener.of((viewUpdate) => {
        onUpdate(viewUpdate);
        // 改变文本
        if (viewUpdate.docChanged) {
          onChange(viewUpdate.state.doc.toString(), viewUpdate);
        }
        // 焦点状态变化
        if (viewUpdate.focusChanged) {
          viewUpdate.view.hasFocus ? onFocus(viewUpdate) : onBlur(viewUpdate);
        }
      }),
    ],
  });
};

export const createEditorView = (config: EditorViewConfig) => new EditorView({ ...config });
export const destroyEditorView = (view: EditorView) => view.destroy();

// 创建编辑器运行方法
export const createEditorCompartment = (view: EditorView) => {
  const compartment = new Compartment();
  const run = (extension: Extension) => {
    compartment.get(view.state)
      ? view.dispatch({ effects: compartment.reconfigure(extension) }) // reconfigure
      : view.dispatch({ effects: StateEffect.appendConfig.of(compartment.of(extension)) }); // inject
  };
  return { compartment, run };
};

// 创建编辑器改变切换配置
export const createEditorExtensionToggler = (view: EditorView, extension: Extension) => {
  const { compartment, run } = createEditorCompartment(view);
  return (targetApply?: boolean) => {
    const exExtension = compartment.get(view.state);
    const apply = targetApply ?? exExtension !== extension;
    run(apply ? extension : []);
  };
};

export const getEditorTools = (view: EditorView): EditorTools => {
  // 设置文本
  const getDoc = () => view.state.doc.toString();
  const setDoc = (newDoc: string) => {
    if (newDoc !== getDoc()) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newDoc,
        },
      });
    }
  };

  // 获得焦点
  const focus = () => view.focus();

  // 重新配置扩展
  const { run: reExtensions } = createEditorCompartment(view);

  // 改变禁止
  const toggleDisabled = createEditorExtensionToggler(view, [EditorView.editable.of(false), EditorState.readOnly.of(true)]);

  // 改变标签
  const toggleIndentWithTab = createEditorExtensionToggler(view, keymap.of([indentWithTab]));

  // 设置编辑器的标签大小
  const { run: reTabSize } = createEditorCompartment(view);
  const setTabSize = (tabSize: number) => {
    reTabSize([EditorState.tabSize.of(tabSize), indentUnit.of(' '.repeat(tabSize))]);
  };

  // 设置编辑器的词组
  const { run: rePhrases } = createEditorCompartment(view);
  const setPhrases = (phrases: Record<string, string>) => {
    rePhrases([EditorState.phrases.of(phrases)]);
  };

  // 设置编辑器的占位符
  const { run: rePlaceholder } = createEditorCompartment(view);
  const setPlaceholder = (value: string) => {
    rePlaceholder(placeholder(value));
  };

  // 设置编辑器的样式
  const { run: reStyle } = createEditorCompartment(view);
  const setStyle = (style: CSSProperties = {}) => {
    reStyle(EditorView.theme({ '&': { ...(style as any) } }));
  };

  return {
    focus,
    getDoc,
    setDoc,
    reExtensions,
    toggleDisabled,
    toggleIndentWithTab,
    setTabSize,
    setPhrases,
    setPlaceholder,
    setStyle,
  };
};
