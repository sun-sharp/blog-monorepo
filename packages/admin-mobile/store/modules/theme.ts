import { defineStore } from 'pinia';
import { storage } from '../../utils/storage';
import { THEME_MODE } from '../../../shared/src/constants/storage-name';

export const useThemeStore = defineStore({
  id: 'app-theme',
  state: () => ({
    isDark: storage.get(THEME_MODE, false) as boolean,
  }),
  actions: {
    setDark(val: boolean) {
      this.isDark = val;
      storage.set(THEME_MODE, val, null);
    },
    toggle() {
      this.setDark(!this.isDark);
    },
  },
});
