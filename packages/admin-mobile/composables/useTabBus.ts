import { ref } from 'vue';

export interface SwitchTabPayload {
  target: number;
  source?: string;
  bankType?: number;
}

const pending = ref<SwitchTabPayload | null>(null);
const version = ref(0);

export function emitSwitchTab(payload: number | SwitchTabPayload): void {
  pending.value = typeof payload === 'number' ? { target: payload } : { ...payload };
  version.value++;
}

export function switchTabBusVersion(): number {
  return version.value;
}

export function consumeSwitchTab(): SwitchTabPayload {
  const payload: SwitchTabPayload = pending.value ? { ...pending.value } : { target: -1 };
  pending.value = null;
  return payload;
}
