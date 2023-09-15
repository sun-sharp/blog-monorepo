<script lang="ts" setup>
  import { useUserStore } from '@/store';
  import { getImgUrl, judgeRangeToFormatTime } from '@/utils';
  import { computed, ref } from 'vue';
  import defaultAvatar from '@/assets/images/common/default-avatar.png';

  const userStore = useUserStore();
  const { username, avatar, roleName, loginDate } = userStore.info;

  const userAvatar = ref(getImgUrl(avatar) || '');

  const showLoginDate = computed(() => {
    return loginDate ? judgeRangeToFormatTime(loginDate) : '';
  });
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
      <p>上次登录时间： {{ showLoginDate }}</p>
    </div>
  </div>
</template>

<style lang="scss">
  .user-info {
    min-width: 250px;
    max-width: 300px;
    max-height: 220px;
    padding: 20px;
    background-color: $card-background-color;
    border-radius: $card-border-radius;
    box-shadow: $card-box-shadow;

    &__head {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid $border-divide-color;

      .head-avatar {
        margin-right: 30px;
      }

      .head-info {
        h2 {
          color: $font-color;
          font-size: 30px;
        }

        p {
          color: $font-color;
          font-size: 16px;
        }
      }
    }

    &__foot {
      padding-top: 20px;
    }
  }
</style>
