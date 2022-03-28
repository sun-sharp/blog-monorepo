<template>
  <n-modal v-model:show="showModal" class="w-800" :show-icon="false" :mask-closable="false" preset="dialog" title="导入微信账单">
    <table-all :data="tableData" :columns="columns">
      <template #tableTitle>
        <n-button type="primary">选择文件</n-button>
      </template>
    </table-all>
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="success" :loading="btnLoading" :disabled="btnLoading" @click="confirmForm">保存</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
  // import { weChatApi } from '@/api';
  import { defineComponent, ref } from 'vue';
  import TableAll from '@/components/Table/table-all.vue';

  export default defineComponent({
    name: 'ImageNotUseModel',
    components: { TableAll },
    emits: ['refresh'],
    setup(_props, { emit }) {
      const showModal = ref(false);
      const btnLoading = ref(false);
      const tableData = ref<any>([]);
      // 获取接口数据
      // const getTableData = async () => {
      //   tableData.value = await imageApi.getOntUse();
      // };
      const columns = [
        {
          title: '交易时间',
          key: 'tradeTime',
          align: 'center',
        },
        {
          title: '交易类型',
          key: 'tradeType',
          align: 'center',
        },
        {
          title: '交易对方',
          key: 'tradeOtherPerson',
          align: 'center',
        },
        {
          title: '收/支',
          key: 'incomeOrPay',
          align: 'center',
        },
        {
          title: '金额(元)',
          key: 'moneyAmount',
          align: 'center',
        },
        {
          title: '支付方式',
          key: 'paymentMethod',
          align: 'center',
        },
        {
          title: '当前状态',
          key: 'currentStatus',
          align: 'center',
        },
        {
          title: '备注',
          key: 'remarks',
          align: 'center',
        },
      ];
      // 初始化
      const init = async () => {
        showModal.value = true;
        // await getTableData();
      };

      // 清空列表数据
      const confirmForm = () => {
        emit('refresh');
      };
      return {
        showModal,
        btnLoading,
        tableData,
        columns,
        init,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss" scoped></style>
