import { defineComponent, shallowRef, computed, watch, toRaw, onMounted, onBeforeUnmount, h, ExtractPropTypes, PropType } from 'vue';
import { App, inject } from 'vue';
import { basicSetup } from 'codemirror';
import type { CSSProperties } from 'vue';
import { EditorState, EditorStateConfig, Compartment, Extension, StateEffect } from '@codemirror/state';
import { EditorView, EditorViewConfig, ViewUpdate, keymap, placeholder } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { indentUnit } from '@codemirror/language';

export enum EventKey {
  Change = 'change',
  Update = 'update',
  Focus = 'focus',
  Blur = 'blur',
  Ready = 'ready',
  ModelUpdate = 'update:modelValue',
}

export const editorEvents = {
  // when content(doc) change only
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [EventKey.Change]: (_value: string, _viewUpdate: ViewUpdate) => {
    return true;
  },
  // when codemirror state change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [EventKey.Update]: (_viewUpdate: ViewUpdate) => {
    return true;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [EventKey.Focus]: (_viewUpdate: ViewUpdate) => {
    return true;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [EventKey.Blur]: (_viewUpdate: ViewUpdate) => {
    return true;
  },
  // when component mounted
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [EventKey.Ready]: (_payload: { view: EditorView; state: EditorState; container: HTMLDivElement }) => {
    return true;
  },
};

export const modelUpdateEvent = {
  [EventKey.ModelUpdate]: editorEvents[EventKey.Change],
};

export const events = {
  ...editorEvents,
  ...modelUpdateEvent,
};

export type EditorEvents = typeof editorEvents;
export type Events = typeof events;

const UNDEFINED = void 0;
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
  extensions: Array as PropType<EditorStateConfig['extensions']>,
  selection: Object as PropType<EditorStateConfig['selection']>,
};

export const modelValueProp = {
  modelValue: {
    type: String,
    default: '',
  },
};

export const props = {
  ...configProps,
  ...modelValueProp,
};

export type ConfigProps = ExtractPropTypes<typeof configProps>;
export type Props = ExtractPropTypes<typeof props>;
export type PropKey = keyof Props;

export const DEFAULT_CONFIG: Readonly<Partial<ConfigProps>> = Object.freeze({
  autofocus: false,
  disabled: false,
  indentWithTab: true,
  tabSize: 2,
  placeholder: '',
  autoDestroy: true,
  extensions: [basicSetup],
});

const CONFIG_SYMBOL = Symbol('vue-codemirror-global-config');
export const injectGlobalConfig = (app: App, config?: ConfigProps) => {
  app.provide(CONFIG_SYMBOL, config);
};

export const useGlobalConfig = () => {
  return inject<ConfigProps>(CONFIG_SYMBOL, {} as ConfigProps);
};

export interface CreateStateOptions extends EditorStateConfig {
  onChange(doc: string, viewUpdate: ViewUpdate): void;
  onUpdate(viewUpdate: ViewUpdate): void;
  onFocus(viewUpdate: ViewUpdate): void;
  onBlur(viewUpdate: ViewUpdate): void;
}

export const createEditorState = ({ onUpdate, onChange, onFocus, onBlur, ...config }: CreateStateOptions) => {
  return EditorState.create({
    doc: config.doc,
    selection: config.selection,
    extensions: [
      ...(Array.isArray(config.extensions) ? config.extensions : [config.extensions]),
      EditorView.updateListener.of((viewUpdate) => {
        // https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/11
        onUpdate(viewUpdate);
        // doc changed
        if (viewUpdate.docChanged) {
          onChange(viewUpdate.state.doc.toString(), viewUpdate);
        }
        // focus state change
        if (viewUpdate.focusChanged) {
          viewUpdate.view.hasFocus ? onFocus(viewUpdate) : onBlur(viewUpdate);
        }
      }),
    ],
  });
};

export const createEditorView = (config: EditorViewConfig) => new EditorView({ ...config });
export const destroyEditorView = (view: EditorView) => view.destroy();

// https://codemirror.net/examples/config/
// https://github.com/uiwjs/react-codemirror/blob/22cc81971a/src/useCodeMirror.ts#L144
// https://gist.github.com/s-cork/e7104bace090702f6acbc3004228f2cb
export const createEditorCompartment = (view: EditorView) => {
  const compartment = new Compartment();
  const run = (extension: Extension) => {
    compartment.get(view.state)
      ? view.dispatch({ effects: compartment.reconfigure(extension) }) // reconfigure
      : view.dispatch({ effects: StateEffect.appendConfig.of(compartment.of(extension)) }); // inject
  };
  return { compartment, run };
};

// https://codemirror.net/examples/reconfigure/
export const createEditorExtensionToggler = (view: EditorView, extension: Extension) => {
  const { compartment, run } = createEditorCompartment(view);
  return (targetApply?: boolean) => {
    const exExtension = compartment.get(view.state);
    const apply = targetApply ?? exExtension !== extension;
    run(apply ? extension : []);
  };
};

export const getEditorTools = (view: EditorView) => {
  // doc state
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

  // UX operations
  const focus = () => view.focus();

  // reconfigure extension
  const { run: reExtensions } = createEditorCompartment(view);

  // disabled editor
  const toggleDisabled = createEditorExtensionToggler(view, [EditorView.editable.of(false), EditorState.readOnly.of(true)]);

  // https://codemirror.net/examples/tab/
  const toggleIndentWithTab = createEditorExtensionToggler(view, keymap.of([indentWithTab]));

  // tab size
  // https://gist.github.com/s-cork/e7104bace090702f6acbc3004228f2cb
  const { run: reTabSize } = createEditorCompartment(view);
  const setTabSize = (tabSize: number) => {
    reTabSize([EditorState.tabSize.of(tabSize), indentUnit.of(' '.repeat(tabSize))]);
  };

  // phrases
  // https://codemirror.net/examples/translate/
  const { run: rePhrases } = createEditorCompartment(view);
  const setPhrases = (phrases: Record<string, string>) => {
    rePhrases([EditorState.phrases.of(phrases)]);
  };

  // set editor's placeholder
  const { run: rePlaceholder } = createEditorCompartment(view);
  const setPlaceholder = (value: string) => {
    rePlaceholder(placeholder(value));
  };

  // set style to editor element
  // https://codemirror.net/examples/styling/
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

export const Codemirror = defineComponent({
  name: 'VueCodemirror',
  props: { ...props },
  emits: { ...events },
  setup(props, context) {
    const container = shallowRef<HTMLDivElement>();
    const state = shallowRef<EditorState>();
    const view = shallowRef<EditorView>();

    const defaultConfig: ConfigProps = {
      ...DEFAULT_CONFIG,
      ...useGlobalConfig(),
    };

    const config = computed<ConfigProps>(() => {
      const result = {} as Required<ConfigProps>;
      Object.keys(toRaw(props)).forEach((key: any) => {
        if (key !== 'modelValue') {
          // @ts-ignore
          // MARK: ensure access to `prop[key]` original object
          result[key] = props[key] ?? defaultConfig[key];
        }
      });
      return result;
    });

    onMounted(() => {
      state.value = createEditorState({
        doc: props.modelValue,
        selection: config.value.selection,
        // The extensions are split into two parts, global and component prop.
        // Only the global part is initialized here.
        // The prop part is dynamically reconfigured after the component is mounted.
        extensions: defaultConfig.extensions ?? [],
        onFocus: (viewUpdate) => context.emit(EventKey.Focus, viewUpdate),
        onBlur: (viewUpdate) => context.emit(EventKey.Blur, viewUpdate),
        onUpdate: (viewUpdate) => context.emit(EventKey.Update, viewUpdate),
        onChange: (newDoc, viewUpdate) => {
          if (newDoc !== props.modelValue) {
            context.emit(EventKey.Change, newDoc, viewUpdate);
            context.emit(EventKey.ModelUpdate, newDoc, viewUpdate);
          }
        },
      });

      view.value = createEditorView({
        state: state.value,
        parent: container.value!,
        root: config.value.root,
      });

      const editorTools = getEditorTools(view.value);

      // watch prop.modelValue
      watch(
        () => props.modelValue,
        (newValue) => {
          if (newValue !== editorTools.getDoc()) {
            editorTools.setDoc(newValue);
          }
        }
      );

      // watch prop.extensions
      watch(
        () => props.extensions,
        (extensions) => editorTools.reExtensions(extensions || []),
        { immediate: true }
      );

      // watch prop.disabled
      watch(
        () => config.value.disabled,
        (disabled) => editorTools.toggleDisabled(disabled),
        { immediate: true }
      );

      // watch prop.indentWithTab
      watch(
        () => config.value.indentWithTab,
        (iwt) => editorTools.toggleIndentWithTab(iwt),
        { immediate: true }
      );

      // watch prop.tabSize
      watch(
        () => config.value.tabSize,
        (tabSize) => editorTools.setTabSize(tabSize!),
        { immediate: true }
      );

      // watch prop.phrases
      watch(
        () => config.value.phrases,
        (phrases) => editorTools.setPhrases(phrases || {}),
        { immediate: true }
      );

      // watch prop.placeholder
      watch(
        () => config.value.placeholder,
        (placeholder) => editorTools.setPlaceholder(placeholder!),
        { immediate: true }
      );

      // watch prop.style
      watch(
        () => config.value.style,
        (style) => editorTools.setStyle(style),
        { immediate: true }
      );

      // immediate autofocus
      if (config.value.autofocus) {
        editorTools.focus();
      }

      context.emit(EventKey.Ready, {
        state: state.value!,
        view: view.value!,
        container: container.value!,
      });
    });

    onBeforeUnmount(() => {
      if (config.value.autoDestroy && view.value) {
        destroyEditorView(view.value);
      }
    });

    return () => {
      return h('div', {
        style: { display: 'contents' },
        ref: container,
      });
    };
  },
});
