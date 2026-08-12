<template>
  <web-view :src="htmlUrl" @message="handleMessage"></web-view>
</template>

<script lang="ts" setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { blogReqUrl } from '../../../utils/request';
  import { ref } from 'vue';

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
  });
</script>
