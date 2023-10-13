<script lang="ts" setup>
  import { DragOutlined, SettingOutlined, VerticalRightOutlined, VerticalLeftOutlined } from '@/utils';
  import { TableColumnSettingProps, useTableColumnSetting } from './hooks/useTableColumnSetting';
  import Draggable from 'vuedraggable';
  import { useSetting } from '@/hooks';

  defineProps(TableColumnSettingProps);

  const { getAppThemeColor } = useSetting();

  const {
    checkAll,
    allIndeterminate,
    selection,
    checkKeys,
    columnsList,
    onCheckAll,
    onSelection,
    resetColumns,
    onCheckboxGroupChange,
    draggableEnd,
    fixedColumn,
  } = useTableColumnSetting();
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="table-column-setting" :class="className">
        <n-popover trigger="click" placement="bottom-end">
          <template #trigger>
            <n-icon size="18" class="table-column-setting__icon">
              <SettingOutlined />
            </n-icon>
          </template>
          <template #header>
            <div class="pv-3">
              <n-space>
                <n-checkbox v-model:checked="checkAll" :indeterminate="allIndeterminate" @update:checked="onCheckAll">列展示</n-checkbox>
                <n-checkbox v-model:checked="selection" @update:checked="onSelection">勾选列</n-checkbox>
                <n-button text type="info" size="small" class="mt-1" @click="resetColumns">重置</n-button>
              </n-space>
            </div>
          </template>
          <div class="table-column-setting__list">
            <n-checkbox-group v-model:value="checkKeys" @update:value="onCheckboxGroupChange">
              <Draggable v-model="columnsList" animation="300" item-key="key" @end="draggableEnd">
                <template #item="{ element }">
                  <div class="list-checkbox">
                    <span class="drag-icon">
                      <n-icon size="18">
                        <DragOutlined />
                      </n-icon>
                    </span>
                    <n-checkbox :value="element.key" :label="element.title" />
                    <div class="fixed-item">
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <n-icon
                            size="18"
                            :color="element.fixed === 'left' ? getAppThemeColor : undefined"
                            class="cursor-pointer"
                            @click="fixedColumn(element, 'left')"
                          >
                            <VerticalRightOutlined />
                          </n-icon>
                        </template>
                        <span>固定到左侧</span>
                      </n-tooltip>
                      <n-divider vertical />
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <n-icon
                            size="18"
                            :color="element.fixed === 'right' ? getAppThemeColor : undefined"
                            class="cursor-pointer"
                            @click="fixedColumn(element, 'right')"
                          >
                            <VerticalLeftOutlined />
                          </n-icon>
                        </template>
                        <span>固定到右侧</span>
                      </n-tooltip>
                    </div>
                  </div>
                </template>
              </Draggable>
            </n-checkbox-group>
          </div>
        </n-popover>
      </div>
    </template>
    <span>列设置</span>
  </n-tooltip>
</template>

<style lang="scss" scoped>
  .table-column-setting {
    display: flex;
    align-items: center;

    &__icon {
      cursor: pointer;

      &:hover {
        color: $theme-color;
      }
    }

    &__list {
      .list-checkbox {
        display: flex;
        align-items: center;
        padding: 10px 14px;

        &:hover {
          background: #e6f7ff;
        }

        .drag-icon {
          display: inline-flex;
          margin-right: 8px;
          cursor: move;
        }

        .fixed-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-left: auto;
        }
      }
    }
  }
</style>
