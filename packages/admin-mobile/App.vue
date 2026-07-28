<script lang="ts" setup>
  import { onLaunch } from '@dcloudio/uni-app';
  import { useUserStore } from './store';

  onLaunch(() => {
    const userStore = useUserStore();
    if (!userStore.getToken) {
      uni.reLaunch({ url: '/pages/login/login' });
    }
  });
</script>

<style lang="scss">
  @import './styles/common.scss';

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
  /* #endif */
</style>
