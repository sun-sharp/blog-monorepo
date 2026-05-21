<script lang="ts" setup>
  import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
  import { useUserStore } from './store';

  onLaunch(() => {
    console.log('App Launch');
    const userStore = useUserStore();
    if (!userStore.getToken) {
      uni.reLaunch({ url: '/pages/login/login' });
    }
  });

  onShow(() => {
    console.log('App Show');
  });

  onHide(() => {
    console.log('App Hide');
  });
</script>

<style lang="scss">
  @import './styles/common.scss';

  /* uni_modules 方式 */
  @import '@/uni_modules/uview-pro/index.scss';
</style>
