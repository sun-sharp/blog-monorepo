import { ref, computed } from 'vue';

// 与 uView Pro 内部持久化 key 保持一致，确保切换状态跨页/重启不丢失
const DARK_MODE_STORAGE_KEY = 'uview-pro-dark-mode';

export type AppDarkMode = 'auto' | 'light' | 'dark';

function readMode(): AppDarkMode {
  try {
    const val = uni.getStorageSync(DARK_MODE_STORAGE_KEY);
    if (val === 'dark' || val === 'light' || val === 'auto') return val;
  } catch {
    // ignore
  }
  return 'light';
}

const mode = ref<AppDarkMode>(readMode());

const isDark = computed(() => {
  if (mode.value === 'dark') return true;
  if (mode.value === 'light') return false;
  // auto：跟随系统
  try {
    const sys = uni.getSystemInfoSync() as any;
    return sys?.theme === 'dark' || sys?.osTheme === 'dark';
  } catch {
    return false;
  }
});

export function useAppTheme() {
  function setDark(val: boolean) {
    setMode(val ? 'dark' : 'light');
  }

  function setMode(val: AppDarkMode) {
    mode.value = val;
    try {
      uni.setStorageSync(DARK_MODE_STORAGE_KEY, val);
    } catch {
      // ignore
    }
  }

  function toggle() {
    setDark(!isDark.value);
  }

  return {
    mode,
    isDark,
    toggle,
    setDark,
    setMode,
  };
}
