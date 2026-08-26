<script lang="ts" setup>
  import TableAll from '@/components/table/TableAll.vue';
  import FormUploadExcel from '@/components/form/FormUploadExcel.vue';
  import { useBankUploadFileModel } from '../hooks/useBankUploadFileModel';
  import { useApiType } from '@/hooks';
  import { downloadTemplate } from '@/api/blog/money/bank';

  const emit = defineEmits(['refresh']);
  const { getBankTypeOption } = useApiType();

  const {
    modalTitle,
    showModal,
    btnDisabled,
    tableData,
    columns,
    uploadFileList,
    uploadAction,
    btnLoading,
    rowClassName,
    reload,
    excelUploadChange,
    confirmForm,
    selectBankType,
    init,
  } = useBankUploadFileModel(emit);

  defineExpose({ init });

  const handleDownloadTemplate = () => {
    if (!selectBankType.value) return;
    downloadTemplate(selectBankType.value);
  };
</script>

<template>
  <n-modal v-model:show="showModal" class="w-1300" :show-icon="false" :mask-closable="false" preset="dialog" :title="modalTitle">
    <n-space vertical :size="12">
      <n-space align="center" justify="space-between">
        <n-space align="center" :size="12">
          <span>选择银行类型</span>
          <n-select v-model:value="selectBankType" style="width: 200px" placeholder="请选择银行" :options="getBankTypeOption" />
        </n-space>
        <n-button size="small" :disabled="!selectBankType" @click="handleDownloadTemplate">下载该银行模版</n-button>
      </n-space>
      <table-all :data="tableData" :columns="columns" :row-class-name="rowClassName" max-height="50vh" @reload="reload">
        <template #tableTitle>
          <form-upload-excel
            v-model:file-list="uploadFileList"
            :action="uploadAction"
            button-type="primary"
            :disabled="!selectBankType"
            :show-remove-button="false"
            @uploadChange="excelUploadChange" />
        </template>
      </table-all>
    </n-space>
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="success" :loading="btnLoading" :disabled="btnDisabled" @click="confirmForm">保存</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
