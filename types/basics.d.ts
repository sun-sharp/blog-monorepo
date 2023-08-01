import { CSSProperties, VNodeChild } from 'vue';
import { VueTypeValidableDef, VueTypesInterface } from 'vue-types';

type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VNodeChild: VueTypeValidableDef<VueNode>;
};
