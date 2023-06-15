<template>
  <n-modal v-model:show="showModal" class="w-1300" :show-icon="false" :mask-closable="false" preset="dialog" :title="modalTitle">
    <table-all :data="tableData" :columns="columns" :row-class-name="rowClassName" max-height="50vh" @reload="reload">
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
  import { aliPayApi } from '@/api';
  import { getUploadAliPayAction } from '@/utils';
  import { computed, defineComponent, ref } from 'vue';
  import TableAll from '@/components/Table/table-all.vue';
  import FormUploadExcel from '@/components/form/form-upload-excel.vue';
  import { uploadColumns } from './configure';
  import { useApiType } from '@/hooks';

  export default defineComponent({
    name: 'UploadFileModel',
    components: { TableAll, FormUploadExcel },
    emits: ['refresh'],
    setup(_props, { emit }) {
      const showModal = ref(false);
      const tableData = ref<any[]>([]);
      const excelUploadTotal = ref(0);
      const btnDisabled = computed(() => {
        return tableData.value.length === 0 || tableData.value.filter((f) => !f.inflowOrOutflow || !f.billType).length !== 0;
      });
      // 获取账单类型
      const { getBillTypeOption, getBillMethodOption } = useApiType();
      const columns = uploadColumns({ getBillTypeOption, getBillMethodOption });
      const uploadFileList = ref([]);

      // 重新刷新
      const reload = () => {
        tableData.value = [];
        uploadFileList.value = [];
        excelUploadTotal.value = 0;
      };

      // 初始化
      const init = async () => {
        showModal.value = true;
        reload();
      };

      // 表格样式
      const rowClassName = (row: any) => {
        return ![1, 2].includes(row.inflowOrOutflow) || !row.billMethod || !row.billType ? 'bg-red-td' : '';
      };

      // 保存列表数据
      const btnLoading = ref(false);
      const confirmForm = () => {
        btnLoading.value = true;
        aliPayApi
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
        excelUploadTotal.value = tableData.value.concat(data).length;
        tableData.value = tableData.value.concat(data).slice(0, 100);
      };

      const modalTitle = computed(() => {
        return '导入支付宝账单' + `(${tableData.value.length}/${excelUploadTotal.value})`;
      });
      return {
        modalTitle,
        showModal,
        btnDisabled,
        tableData,
        rowClassName,
        excelUploadTotal,
        columns,
        uploadAction: getUploadAliPayAction(),
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
