import type { ComputedRef, Ref } from 'vue';
import { CSSProperties, VNodeChild } from 'vue';
import { VueTypeValidableDef, VueTypesInterface } from 'vue-types';

declare type EmitType = (event: string, ...args: any[]) => void;

export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};

type VueNode = VNodeChild | JSX.Element;

export type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VNodeChild: VueTypeValidableDef<VueNode>;
};
