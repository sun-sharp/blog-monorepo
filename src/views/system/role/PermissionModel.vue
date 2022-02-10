<template>
  <n-modal v-model:show="showModal" class="menu-model w-600" :show-icon="false" preset="dialog" title="修改菜单权限">
    菜单权限

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="btnLoading" :disabled="true" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { menuTypeOption } from '@/enums';

  export default defineComponent({
    setup() {
      const showModal = ref(false);
      const btnLoading = ref(false);

      // 初始化
      const init = (row) => {
        showModal.value = true;
        console.log(row);
      };

      // 提交
      const confirmForm = (e) => {
        e.preventDefault();
        btnLoading.value = true;
      };

      return {
        showModal,
        btnLoading,
        menuTypeOption,
        init,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss"></style>
