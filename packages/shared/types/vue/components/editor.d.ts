import { EditorStateConfig } from '@codemirror/state';

// 创建默认配置
export interface CreateStateOptions extends EditorStateConfig {
  onChange(doc: string, viewUpdate: ViewUpdate): void;
  onUpdate(viewUpdate: ViewUpdate): void;
  onFocus(viewUpdate: ViewUpdate): void;
  onBlur(viewUpdate: ViewUpdate): void;
}

//
export type EditorTools = {
  focus: () => void;
  getDoc: () => string;
  setDoc: (newDoc: string) => void;
  reExtensions: (extension: Extension) => void;
  toggleDisabled: (targetApply?: boolean) => void;
  toggleIndentWithTab: (targetApply?: boolean) => void;
  setTabSize: (tabSize: number) => void;
  setPhrases: (phrases: Record<string, string>) => void;
  setPlaceholder: (value: string) => void;
  setStyle: (style?: CSSProperties) => void;
};
