<template>
  <n-modal v-model:show="showModal" class="w-800" :show-icon="false" :mask-closable="false" preset="dialog" title="处理只有图片文件的数据">
    <table-all :data="imageOnlyData" :columns="columns" />
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="error" :loading="btnLoading" :disabled="btnLoading" @click="clearList">清空列表</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
  import { imageApi } from '@/api';
  import { defineComponent, h, ref } from 'vue';
  import TableAll from '@/components/Table/table-all.vue';
  import { NImage } from 'naive-ui';
  import { getImgUrl } from '@/utils';

  export default defineComponent({
    name: 'ImageOnlyPublicModel',
    components: { TableAll },
    setup() {
      const showModal = ref(false);
      const btnLoading = ref(false);
      const imageOnlyData = ref<any>([]);
      // 获取接口数据
      const getOnlyPublicData = async () => {
        imageOnlyData.value = await imageApi.getOnlyPublic();
      };
      const columns = [
        {
          title: '图片名称',
          key: 'name',
          align: 'center',
        },
        {
          title: '图片展示',
          key: 'url',
          align: 'center',
          width: 100,
          render(row: { url: string }) {
            return h(NImage, {
              src: getImgUrl(row.url),
            });
          },
        },
        {
          title: '图片全称',
          key: 'fileName',
          align: 'center',
        },
        {
          title: '图片类型',
          key: 'imageType',
          align: 'center',
        },
      ];
      // 初始化
      const init = async () => {
        showModal.value = true;
        await getOnlyPublicData();
      };

      // 清空列表数据
      const clearList = () => {
        const fileNameArr = imageOnlyData.value.map((m: { fileName: string }) => m.fileName);
        imageApi.removePublicAll(fileNameArr).then(() => {
          showModal.value = false;
        });
      };
      return {
        showModal,
        btnLoading,
        imageOnlyData,
        columns,
        init,
        clearList,
      };
    },
  });
</script>

<style lang="scss" scoped></style>
