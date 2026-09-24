<template>
  <web-view :src="htmlUrl" @message="handleMessage"></web-view>
</template>

<script lang="ts" setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { blogReqUrl } from '../../../utils/request';
  import { ref } from 'vue';
  import { useAppTheme } from '../../../composables/useAppTheme';
  import { DARK_NAV_BAR_FRONT_COLOR, DARK_NAV_BAR_BG_COLOR, LIGHT_NAV_BAR_FRONT_COLOR, LIGHT_NAV_BAR_BG_COLOR } from '../../../../shared/src/constants';

  const { isDark } = useAppTheme();

  const htmlUrl = ref('');

  function handleMessage(event) {
    console.log(event, 'event');

    const data = event.detail.data;
    if (data.type === 'imagePreview') {
      uni.previewImage({
        current: data.current,
        urls: data.urls,
      });
    }
  }

  onLoad((options: any) => {
    console.log('onLoad 参数:', options);
    htmlUrl.value = `${blogReqUrl(`/article/render?pid=${options.pid}`)}`;
    // 根据主题设置导航栏颜色
    uni.setNavigationBarColor({
      frontColor: isDark.value ? DARK_NAV_BAR_FRONT_COLOR : LIGHT_NAV_BAR_FRONT_COLOR,
      backgroundColor: isDark.value ? DARK_NAV_BAR_BG_COLOR : LIGHT_NAV_BAR_BG_COLOR,
    });
  });
</script>
