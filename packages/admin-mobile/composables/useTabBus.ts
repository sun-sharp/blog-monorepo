import { reactive, toRef } from 'vue';

interface TabBusState {
  target: number;
}

const state = reactive<TabBusState>({ target: -1 });

export function emitSwitchTab(index: number): void {
  state.target = index;
}

export const tabTargetRef = toRef(state, 'target');

export function consumeSwitchTab(): number {
  const target = state.target;
  state.target = -1;
  return target;
}
