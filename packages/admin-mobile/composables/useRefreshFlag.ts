import { reactive } from 'vue';

const flags = reactive<Record<string, boolean>>({});

export function setRefreshFlag(key: string): void {
  flags[key] = true;
}

export function consumeRefreshFlag(key: string): boolean {
  if (flags[key]) {
    flags[key] = false;
    return true;
  }
  return false;
}

