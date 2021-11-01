<template>
  <n-card :bordered="false" class="proCard">
    <basic-form @register="searchRegister" @submit="searchSubmit" @reset="searchReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </basic-form>
    <div class="table-toolbar">
      <!--顶部左侧区域-->
      <div class="flex items-center table-toolbar-left">
        <n-button type="primary" @click="showModal = true">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </div>

      <div class="flex items-center table-toolbar-right">
        <!--刷新-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="table-toolbar-right-icon" @click="loadDataTable">
              <n-icon size="18">
                <ReloadOutlined />
              </n-icon>
            </div>
          </template>
          <span>刷新</span>
        </n-tooltip>

        <!--密度-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="table-toolbar-right-icon">
              <n-dropdown v-model:value="tableSize" trigger="click" :options="densityOptions" @select="densitySelect">
                <n-icon size="18">
                  <ColumnHeightOutlined />
                </n-icon>
              </n-dropdown>
            </div>
          </template>
          <span>密度</span>
        </n-tooltip>
      </div>
    </div>
    <n-data-table :size="tableSize" :loading="tableLoading" :columns="columns" :data="tableData" :row-key="rowKey" />
    <n-modal v-model:show="showModal" class="w-600" :show-icon="false" preset="dialog" title="新建">
      <basic-form @register="modelRegister">
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </basic-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { adminMenus } from '@/api/system/menu';
  import { useMessage } from 'naive-ui';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useConfigure } from './configure';
  import { levelMenu } from '@/utils';
  import { PlusOutlined, ReloadOutlined, ColumnHeightOutlined } from '@vicons/antd';

  // 配置表格密度
  const densityOptions = [
    {
      type: 'menu',
      label: '紧凑',
      key: 'small',
    },
    {
      type: 'menu',
      label: '默认',
      key: 'medium',
    },
    {
      type: 'menu',
      label: '宽松',
      key: 'large',
    },
  ];
  const tableSize = ref('medium');

  // 表格
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const tableData = ref<any>([]);
  const rowKey = (row) => row.name;
  const tableLoading = ref(false);

  /**
   * 表格
   *  */
  // 获取接口数据
  const loadDataTable = () => {
    tableLoading.value = true;
    const params = {};
    adminMenus({ ...params })
      .then((res) => {
        tableData.value = levelMenu(res);
        console.log(tableData.value);
      })
      .finally(() => {
        setTimeout(() => {
          tableLoading.value = false;
        }, 1000);
      });
  };

  // 配置
  const message = useMessage();
  const { searchSchemas, columns, modelSchemas } = useConfigure({ message, loadDataTable, showModal });

  // 查询
  const [searchRegister, {}] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas: searchSchemas,
    showAdvancedButton: false,
    showResetButton: false,
  });

  /**
   * 查询
   *  */
  // 数据查询
  const searchSubmit = (values: Recordable) => {
    console.log(values);
    loadDataTable();
  };
  // 数据重置
  const searchReset = (values: Recordable) => {
    console.log(values);
  };

  /**
   * 弹窗
   *  */
  const [modelRegister, {}] = useForm({
    gridProps: { cols: '1' },
    labelWidth: 80,
    schemas: modelSchemas,
    layout: 'screen',
    showAdvancedButton: false,
    showResetButton: false,
    showSubmitButton: false,
  });
  const confirmForm = (e) => {
    e.preventDefault();
    formBtnLoading.value = true;
    // formRef.value.validate((errors) => {
    //   if (!errors) {
    //     message.success('新建成功');
    //     setTimeout(() => {
    //       showModal.value = false;
    //       reloadTable();
    //     });
    //   } else {
    //     message.error('请填写完整信息');
    //   }
    //   formBtnLoading.value = false;
    // });
  };

  //密度切换
  const densitySelect = (e) => {
    tableSize.value = e;
  };

  onMounted(() => {
    // nextTick(() => {
    loadDataTable();
    // });
  });
</script>
<style lang="scss" scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 16px 0;

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;

      &-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        font-weight: 600;
      }
    }

    &-right {
      display: flex;
      justify-content: flex-end;
      flex: 1;

      &-icon {
        margin-left: 12px;
        font-size: 16px;
        cursor: pointer;
        color: var(--text-color);

        :hover {
          color: #1890ff;
        }
      }
    }
  }

  .table-toolbar-inner-popover-title {
    padding: 2px 0;
  }
</style>
