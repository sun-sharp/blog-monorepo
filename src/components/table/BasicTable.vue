<script lang="ts" setup>
  import { QuestionCircleOutlined, ColumnHeightOutlined, ReloadOutlined } from '@/utils/icons';
  import ColumnSetting from './table-column-setting.vue';
  import { BasicTableProps, useBasicTable } from './hooks/useBasicTable';

  const props = defineProps(BasicTableProps);

  const emit = defineEmits(['fetch-success', 'fetch-error', 'update:checked-row-keys', 'edit-end', 'edit-cancel', 'edit-row-end', 'edit-change']);

  const { tableElRef, updateCheckedRowKeys } = useBasicTable(props, emit);
</script>

<template>
  <div class="table-toolbar">
    <!--顶部左侧区域-->
    <div class="flex items-center table-toolbar-left">
      <template v-if="getProps.title">
        <div class="table-toolbar-left-title">
          {{ getProps.title }}
          <n-tooltip v-if="getProps.titleTooltip" trigger="hover">
            <template #trigger>
              <n-icon size="18" class="ml-1 cursor-pointer text-gray-400">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            {{ getProps.titleTooltip }}
          </n-tooltip>
        </div>
      </template>
      <slot name="tableTitle"></slot>
    </div>

    <div class="flex items-center table-toolbar-right">
      <!--顶部右侧区域-->
      <slot name="toolbar"></slot>

      <!--刷新-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon" @click="reload">
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

      <!--表格设置单独抽离成组件-->
      <ColumnSetting />
    </div>
  </div>
  <div class="s-table">
    <n-data-table
      ref="tableElRef"
      v-bind="getBindValues"
      :pagination="pagination"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
      @on-update:checked-row-keys="updateCheckedRowKeys"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </n-data-table>
  </div>
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
