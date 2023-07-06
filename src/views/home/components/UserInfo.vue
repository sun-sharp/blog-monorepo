<script lang="ts" setup>
  import { useUserStore } from '@/store';
  import { getImgUrl } from '@/utils';
  import { ref } from 'vue';
  import defaultAvatar from '@/assets/images/common/default-avatar.png';

  const userStore = useUserStore();
  const { username, avatar, roleName, loginDate } = userStore.info;

  const userAvatar = ref(getImgUrl(avatar) || '');
</script>

<template>
  <div class="user-info">
    <div class="user-info__head">
      <div class="head-avatar"><n-avatar :style="{ '--n-merged-size': '80px' }" round :src="userAvatar" :fallback-src="defaultAvatar" /></div>
      <div class="head-info">
        <h2>{{ username }}</h2>
        <p>{{ roleName }}</p>
      </div>
    </div>
    <div class="user-info__foot">
      <p>上次登录时间： {{ loginDate }}</p>
    </div>
  </div>
</template>

<style lang="scss">
  .user-info {
    max-width: 300px;
    min-width: 250px;
    padding: 20px;
    background-color: $card-background-color;
    border-radius: $card-border-radius;
    box-shadow: $card-box-shadow;

    &__head {
      border-bottom: 1px solid $border-divide-color;
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .head-avatar {
        margin-right: 30px;
      }

      .head-info {
        h2 {
          font-size: 30px;
          color: $font-color;
        }

        p {
          font-size: 16px;
          color: $font-color;
        }
      }
    }

    &__foot {
      padding-top: 20px;
    }
  }
</style>
