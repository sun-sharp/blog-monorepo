<template>
  <n-modal v-model:show="showModal" class="w-1300" :show-icon="false" :mask-closable="false" preset="dialog" title="导入微信账单">
    <table-all :data="tableData" :columns="columns" max-height="50vh" @reload="reload">
      <template #tableTitle>
        <form-upload-excel
          v-model:file-list="uploadFileList"
          :action="uploadAction"
          button-type="primary"
          :show-remove-button="false"
          @uploadChange="excelUploadChange"
        />
      </template>
    </table-all>
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="success" :loading="btnLoading" :disabled="btnDisabled" @click="confirmForm">保存</n-button>
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
    name: 'UploadFileModel',
    components: { TableAll, FormUploadExcel },
    emits: ['refresh'],
    setup(_props, { emit }) {
      const showModal = ref(false);
      const tableData = ref<any[]>([]);
      const btnDisabled = computed(() => {
        return tableData.value.length === 0 || tableData.value.filter((f) => !f.inflowOrOutflow || !f.billType).length !== 0;
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
        reload();
      };

      // 保存列表数据
      const btnLoading = ref(false);
      const confirmForm = () => {
        btnLoading.value = true;
        weChatApi
          .batchSave({
            batches: tableData.value,
          })
          .then(() => {
            showModal.value = false;
            emit('refresh');
          })
          .finally(() => {
            btnLoading.value = false;
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
        btnLoading,
        init,
        reload,
        confirmForm,
        excelUploadChange,
      };
    },
  });
</script>

<style lang="scss" scoped></style>
