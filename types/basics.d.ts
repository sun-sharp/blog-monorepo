import type { ComputedRef, Ref } from 'vue';

declare type EmitType = (event: string, ...args: any[]) => void;

export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};
