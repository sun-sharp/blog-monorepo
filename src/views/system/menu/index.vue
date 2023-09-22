<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue';
  import { menuApi } from '@/api';
  import { useMenuConfigure } from './hooks/useMenuConfigure';
  import { levelMenu, ReloadOutlined, ColumnHeightOutlined, PlusOutlined } from '@/utils';
  import { ApiLevelMenuItem, ApiMenuFindAllParams } from '/#/api/menu';
  import { densityOptions } from '@/components/table';
  import { TableDensityOptionKey } from '/#/components/table';
  import FormSearch from '@/components/form/FormSearch.vue';
  import MenuAddUpdateModel from './components/MenuAddUpdateModel.vue';

  const addUpdateModelRef = ref<Component>();

  // 配置表格密度
  const tableSize = ref<TableDensityOptionKey>('medium');

  // 表格
  const tableData = ref<ApiLevelMenuItem[]>([]);
  const rowKey = (row: ApiLevelMenuItem) => row.name;
  const tableLoading = ref(false);

  /**
   * 表格
   *  */
  // 获取接口数据
  let searchParams: ApiMenuFindAllParams = {};
  const loadDataTable = () => {
    tableLoading.value = true;
    menuApi
      .getMenuList(searchParams)
      .then((res) => {
        tableData.value = levelMenu(res);
      })
      .finally(() => {
        tableLoading.value = false;
      });
  };

  // 配置
  const { searchSchemas, columns } = useMenuConfigure({ loadDataTable, addUpdateModelRef });

  /**
   * 查询
   *  */
  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams = values;
    loadDataTable();
  };

  //密度切换
  const densitySelect = (e: TableDensityOptionKey) => {
    tableSize.value = e;
  };

  onMounted(() => {
    nextTick(() => {
      loadDataTable();
    });
  });
</script>

<template>
  <n-card :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <div class="table-toolbar">
      <!--顶部左侧区域-->
      <div class="flex items-center table-toolbar-left">
        <n-button type="primary" @click="addUpdateModelRef.init()">
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
    <menu-add-update-model ref="addUpdateModelRef" :table-data="tableData" @refurbish="loadDataTable" />
  </n-card>
</template>

<style lang="scss" scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 16px;

    &-left {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-start;

      &-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-weight: 600;
        font-size: 16px;
      }
    }

    &-right {
      display: flex;
      flex: 1;
      justify-content: flex-end;

      &-icon {
        margin-left: 12px;
        color: var(--text-color);
        font-size: 16px;
        cursor: pointer;

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
./hooks/configure
