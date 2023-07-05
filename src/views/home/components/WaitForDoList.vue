<script lang="ts" setup>
  import { PlusOutlined, CalendarOutline } from '@/utils';
  import { ref } from 'vue';
  import Draggable from 'vuedraggable';

  const waitTabsName = ref(1);

  const endDragList = ref([]);
  const runDragList = ref([]);
</script>

<template>
  <div class="wait-for-do-list">
    <div class="wait-for-do-list__add">
      <n-input placeholder="添加待办事件，按回车保存">
        <template #prefix>
          <n-icon :component="PlusOutlined" color="#2d8cf0" />
        </template>
        <template #suffix>
          <div class="add-calendar">
            <n-icon :component="CalendarOutline" />
            <span class="add-time">7月4日</span>
          </div>
        </template>
      </n-input>
    </div>
    <n-tabs v-model:value="waitTabsName" justify-content="space-evenly" type="line">
      <n-tab-pane :name="1" tab="进行中">
        <Draggable v-model="runDragList" animation="300" item-key="key">
          <template #item="{ element }">
            {{ element.name }}
          </template>
        </Draggable>
      </n-tab-pane>
      <n-tab-pane :name="2" tab="已完成">
        <Draggable v-model="endDragList" animation="300" item-key="key">
          <template #item="{ element }">
            {{ element.name }}
          </template>
        </Draggable>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss">
  .wait-for-do-list {
    min-width: 500px;
    max-width: 800px;
    padding: 10px 20px;
    background-color: $card-background-color;
    border-radius: $card-border-radius;
    box-shadow: $card-box-shadow;
    // position: relative;

    &__add {
      // display: flex;
      // width: 100%;
      // flex-wrap: nowrap;
      // vertical-align: bottom;
      // border: 1px solid $border-input-color;
      // position: absolute;
      // right: 5px;
      // top: 5px;
      // cursor: pointer;

      .add-calendar {
        cursor: pointer;
        color: #c2c2c2;
        display: flex;
        align-items: center;
      }
      .add-time {
        margin-left: 10px;
        font-size: 14px;
      }
    }
  }
</style>
