<script lang="ts" setup>
  import { QuestionCircleOutlined, ColumnHeightOutlined, ReloadOutlined } from '@/utils/icons';
  import TableColumnSetting from './TableColumnSetting.vue';
  import { TableToolbarProps, useTableToolbar } from './hooks/useTableToolbar';
  import { densityOptions } from '@shared/constants/table-const';

  const props = defineProps(TableToolbarProps);

  const emit = defineEmits(['update:size', 'reload']);

  const { tableSize, densitySelect } = useTableToolbar(props, emit);
</script>

<template>
  <div class="table-toolbar">
    <!--顶部左侧区域-->
    <div class="flex items-center table-toolbar-left">
      <template v-if="title">
        <div class="table-toolbar-left-title">
          {{ title }}
          <n-tooltip v-if="titleTooltip" trigger="hover">
            <template #trigger>
              <n-icon size="18" class="ml-1 cursor-pointer text-gray-400">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            {{ titleTooltip }}
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
          <n-icon class="table-toolbar-right-icon" size="18" @click="emit('reload')">
            <ReloadOutlined />
          </n-icon>
        </template>
        <span>刷新</span>
      </n-tooltip>

      <!--密度-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="ml-12 flex ai-c">
            <n-dropdown v-model:value="tableSize" trigger="click" :options="densityOptions" @select="densitySelect">
              <n-icon class="table-toolbar-right-icon" size="18">
                <ColumnHeightOutlined />
              </n-icon>
            </n-dropdown>
          </div>
        </template>
        <span>密度</span>
      </n-tooltip>

      <!--表格设置单独抽离成组件-->
      <table-column-setting v-if="hasColumnSetting" class-name="ml-12" :table-fixed="columnSettingFixed" :has-selection="hasSelection" />
    </div>
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
      align-items: center;
      justify-content: flex-end;

      &-icon {
        cursor: pointer;

        &:hover {
          color: $theme-color;
        }
      }
    }
  }
</style>
