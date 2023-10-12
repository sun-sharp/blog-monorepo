<script lang="ts" setup>
  import { SettingOutlined, DragOutlined, VerticalRightOutlined, VerticalLeftOutlined } from '@/utils';
  import Draggable from 'vuedraggable/src/vuedraggable';
  import { useTableColumnSetting } from './hooks/useTableColumnSetting';

  const { checkAll, getAppTheme } = useTableColumnSetting();
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="cursor-pointer table-toolbar-right-icon">
        <n-popover trigger="click" :width="230" class="toolbar-popover" placement="bottom-end">
          <template #trigger>
            <n-icon size="18">
              <SettingOutlined />
            </n-icon>
          </template>
          <template #header>
            <div class="table-toolbar-inner-popover-title">
              <n-space>
                <n-checkbox v-model:checked="checkAll" @update:checked="onCheckAll">列展示</n-checkbox>
                <n-checkbox v-model:checked="selection" @update:checked="onSelection">勾选列</n-checkbox>
                <n-button text type="info" size="small" class="mt-1" @click="resetColumns">重置</n-button>
              </n-space>
            </div>
          </template>
          <div class="table-toolbar-inner">
            <n-checkbox-group v-model:value="checkList" @update:value="onChange">
              <Draggable v-model="columnsList" animation="300" item-key="key" @end="draggableEnd">
                <template #item="{ element }">
                  <div class="table-toolbar-inner-checkbox" :class="{ 'table-toolbar-inner-checkbox-dark': getAppTheme === 'dark' }">
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
                            :color="element.fixed === 'left' ? '#2080f0' : undefined"
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
                            :color="element.fixed === 'right' ? '#2080f0' : undefined"
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
