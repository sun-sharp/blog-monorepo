<script lang="ts" setup>
  import { useMenuConfigure } from './hooks/useMenuConfigure';
  import { ReloadOutlined, ColumnHeightOutlined, PlusOutlined } from '@/utils';
  import { ApiLevelMenuItem } from '/#/api/menu';
  import { densityOptions } from '@/components/table';
  import FormSearch from '@/components/form/FormSearch.vue';
  import MenuAddUpdateModel from './components/MenuAddUpdateModel.vue';

  // 表格key
  const rowKey = (row: ApiLevelMenuItem) => row.name;

  const { addUpdateModelRef, searchSchemas, tableSize, tableLoading, tableData, columns, densitySelect, searchSubmit, loadDataTable } = useMenuConfigure();
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
