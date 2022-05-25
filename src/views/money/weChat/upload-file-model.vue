<template>
  <n-modal v-model:show="showModal" class="w-1000" :show-icon="false" :mask-closable="false" preset="dialog" title="导入微信账单">
    <table-all :data="tableData" :columns="columns" max-height="60vh" :scroll-x="2000" @reload="reload">
      <template #tableTitle>
        <form-upload-excel
          v-model:file-list="uploadFileList"
          :action="uploadAction"
          button-type="primary"
          source="we-chat"
          :show-remove-button="false"
          @uploadChange="excelUploadChange"
        />
      </template>
    </table-all>
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="success" :disabled="btnDisabled" @click="confirmForm">保存</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
  import { weChatApi } from '@/api';
  import { getUploadWeCharAction } from '@/utils';
  import { computed, defineComponent, ref } from 'vue';
  import TableAll from '@/components/Table/table-all.vue';
  import FormUploadExcel from '@/components/form/form-upload-excel.vue';
  import { uploadColumns } from './configure';

  export default defineComponent({
    name: 'ImageNotUseModel',
    components: { TableAll, FormUploadExcel },
    emits: ['refresh'],
    setup(_props, { emit }) {
      const showModal = ref(false);
      const tableData = ref<any[]>([]);
      const btnDisabled = computed(() => {
        return tableData.value.filter((f) => f.inflowOrOutflow && f.billType).length === 0;
      });
      const columns = uploadColumns();
      const uploadFileList = ref([]);

      // 重新刷新
      const reload = () => {
        tableData.value = [];
        uploadFileList.value = [];
      };

      // 初始化
      const init = async () => {
        showModal.value = true;
        tableData.value = [];
      };

      // 保存列表数据
      const confirmForm = () => {
        weChatApi
          .batchSave({
            batches: tableData.value,
          })
          .then(() => {
            showModal.value = false;
            emit('refresh');
          });
      };

      // 账单上传成功
      const excelUploadChange = (data: any[]) => {
        tableData.value = tableData.value.concat(data);
      };
      return {
        showModal,
        btnDisabled,
        tableData,
        columns,
        uploadAction: getUploadWeCharAction(),
        uploadFileList,
        init,
        reload,
        confirmForm,
        excelUploadChange,
      };
    },
  });
</script>

<style lang="scss" scoped></style>
