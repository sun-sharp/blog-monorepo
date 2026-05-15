<script lang="ts" setup>
  import TableAll from '@/components/table/TableAll.vue';
  import FormUploadExcel from '@/components/form/FormUploadExcel.vue';
  import { useAliPayUploadFileModel } from '../hooks/useAliPayUploadFileModel';

  const emit = defineEmits(['refresh']);

  const {
    showModal,
    modalTitle,
    tableData,
    columns,
    uploadFileList,
    uploadAction,
    btnLoading,
    btnDisabled,
    rowClassName,
    reload,
    excelUploadChange,
    confirmForm,
    init,
  } = useAliPayUploadFileModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-1300" :show-icon="false" :mask-closable="false" preset="dialog" :title="modalTitle">
    <table-all :data="tableData" :columns="columns" :row-class-name="rowClassName" max-height="50vh" @reload="reload">
      <template #tableTitle>
        <form-upload-excel
          v-model:file-list="uploadFileList"
          :action="uploadAction"
          button-type="primary"
          :show-remove-button="false"
          @uploadChange="excelUploadChange" />
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
