<script lang="ts" setup>
  import UserInfo from './components/UserInfo.vue';
  import WaitForDoList from './components/WaitForDoList.vue';
</script>

<template>
  <div class="home">
    <user-info class="mr-20" />
    <wait-for-do-list />
  </div>
</template>

<style lang="scss">
  .home {
    display: flex;
    flex-wrap: wrap;
  }
</style>
