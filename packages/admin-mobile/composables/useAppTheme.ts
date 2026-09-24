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

function readSystemDark(): boolean {
  try {
    const sys = uni.getSystemInfoSync() as any;
    return sys?.theme === 'dark' || sys?.osTheme === 'dark';
  } catch {
    return false;
  }
}

const mode = ref<AppDarkMode>(readMode());
const systemDark = ref(readSystemDark());

// 监听系统主题变化（auto 模式实时响应）
try {
  uni.onThemeChange?.((res: { theme?: string }) => {
    systemDark.value = res?.theme === 'dark';
  });
} catch {
  // ignore
}

// #ifdef H5
try {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      systemDark.value = media.matches;
    };
    if (media.addEventListener) media.addEventListener('change', listener);
    else if (media.addListener) media.addListener(listener);
  }
} catch {
  // ignore
}
// #endif

const isDark = computed(() => {
  if (mode.value === 'dark') return true;
  if (mode.value === 'light') return false;
  // auto：跟随系统
  return systemDark.value;
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
    systemDark,
    toggle,
    setDark,
    setMode,
  };
}
