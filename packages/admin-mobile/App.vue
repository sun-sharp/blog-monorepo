<script lang="ts" setup>
  import { onLaunch, onShow } from '@dcloudio/uni-app';
  import { useUserStore } from './store';
  import { useAppTheme } from './composables/useAppTheme';
  import { initTheme, useTheme } from './uni_modules/uview-pro/libs/hooks/useTheme';

  // 启动时引导 uview-pro 主题系统（读取持久化的 dark-mode，含系统主题监听）
  initTheme();

  onLaunch(() => {
    const userStore = useUserStore();
    if (!userStore.getToken) {
      uni.reLaunch({ url: '/pages/login/login' });
    }
  });

  // 每次前台展示时同步导航栏/窗口底色（pages.json globalStyle 为静态亮色，暗色需动态调整）
  onShow(() => {
    const { mode } = useAppTheme();
    const { setTheme } = useTheme();
    setTheme(mode.value);
  });
</script>

<style lang="scss">
  @import './styles/common.scss';

  @import './styles/sharp-icon.scss';

  @import '@/uni_modules/uview-pro/index.scss';

  page {
    height: 100%;
    overflow: hidden;
  }

  /* #ifdef H5 */
  uni-page-body {
    overflow: hidden !important;
    height: 100% !important;
  }
  page,
  uni-page-body,
  uni-view,
  view,
  text {
    user-select: text;
    -webkit-user-select: text;
  }
  .u-config-provider {
    height: 100%;
    overflow: hidden;
  }
  /* #endif */
</style>
