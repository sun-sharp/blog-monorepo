<template>
  <n-avatar v-bind="$props">
    <UserOutlined />
  </n-avatar>
</template>

<script lang="ts">
  import { UserOutlined } from '@/utils/icons';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AppAvatar',
    components: { UserOutlined },
    props: {
      src: {
        type: [String],
        default: '',
      },
      round: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
      return {};
    },
  });
</script>
