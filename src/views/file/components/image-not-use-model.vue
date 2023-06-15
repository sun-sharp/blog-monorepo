<template>
  <n-modal v-model:show="showModal" class="w-800" :show-icon="false" :mask-closable="false" preset="dialog" title="查询未使用的图片">
    <table-all :data="tableData" :columns="columns" />
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
  import { defineComponent, h, ref, unref, computed } from 'vue';
  import TableAll from '@/components/Table/table-all.vue';
  import { NImage } from 'naive-ui';
  import { getImgUrl } from '@/utils';
  import { useApiType } from '@/hooks';
  import { COption } from '/#/config';

  export default defineComponent({
    name: 'ImageNotUseModel',
    components: { TableAll },
    emits: ['refresh'],
    setup(_props, { emit }) {
      const showModal = ref(false);
      const btnLoading = ref(false);
      const tableData = ref<any>([]);
      // 获取接口数据
      const getTableData = async () => {
        tableData.value = await imageApi.getOntUse();
      };

      const { getImageSourceOption } = useApiType();

      const columns = computed(() => [
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
          render(row: Recordable) {
            return h(NImage, {
              src: getImgUrl(row.url),
              alt: '图片文件不存在',
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
        {
          title: '图片来源',
          key: 'source',
          align: 'center',
          render(row: Recordable) {
            const find = unref(getImageSourceOption).find((f: COption) => f.value === row.source);
            return find ? find.label : `*${row.source || ''}`;
          },
        },
        {
          title: '上传时间',
          key: 'uploadTime',
          align: 'center',
        },
      ]);
      // 初始化
      const init = async () => {
        showModal.value = true;
        await getTableData();
      };

      // 清空列表数据
      const clearList = () => {
        const imageIdArr = tableData.value.map((m: { imageId: string }) => m.imageId);
        imageApi.removePublicAndDataAll(imageIdArr).then(() => {
          showModal.value = false;
          emit('refresh');
        });
      };
      return {
        showModal,
        btnLoading,
        tableData,
        columns,
        init,
        clearList,
      };
    },
  });
</script>

<style lang="scss" scoped></style>
