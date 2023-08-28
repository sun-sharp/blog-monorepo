<template>
  <div class="flex flex-col justify-center page-container">
    <div class="text-center">
      <img src="~@/assets/images/error/404.svg" alt="" />
    </div>
    <div class="text-center">
      <h1 class="text-base text-gray-500">抱歉，你访问的页面不存在</h1>
      <n-button type="info" @click="goHome">回到首页</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const goHome = () => {
    router.push('/');
  };
</script>

<style lang="scss" scoped>
  .page-container {
    width: 100%;
    height: 100vh;
    padding: 50px 0;
    border-radius: 4px;

    .text-center {
      h1 {
        padding: 20px 0;
        color: #666;
      }
    }

    img {
      width: 350px;
      margin: 0 auto;
    }
  }
</style>
