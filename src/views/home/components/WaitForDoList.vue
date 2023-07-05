<script lang="ts" setup>
  import { PlusOutlined, CalendarOutline } from '@/utils';
  // import { format } from 'date-fns';
  import { ref } from 'vue';
  import Draggable from 'vuedraggable';
  // import { format } from 'date-fns';

  // 分类选择
  const classifyValue = ref('');
  const classifyOptions = ref([
    {
      label: '全部',
      value: '',
    },
    {
      label: '类型1',
      value: '1',
    },
  ]);

  // 截止时间
  const formatText = 'yyyy-MM-dd HH:00:00';
  const deadline = ref(null);
  const setDeadline = () => {
    showCalendarPop.value = false;
  };

  // 待办事项-日期下拉
  const showCalendarPop = ref(false);
  const calendarPopOutside = () => {
    showCalendarPop.value = false;
  };

  // 状态展示
  const waitTabsName = ref(1);

  const waitDragList = ref([
    {
      waitForDoId: '152424',
      title: '标题1',
      classify: '1',
      deadline: '',
      remark: '备注',
      state: 1,
      sort: 1,
    },
    {
      waitForDoId: '15458787',
      title: '标题2',
      classify: '1',
      deadline: '',
      remark: '备注萨达尽快哈科技汇顶科技阿莎撒电力科技撒肯德基撒科技大拉卡萨进啦抗打击洒基打撒立卡啦受打击了撒决斗链接萨拉较大卡仕达酱凯撒记录卡',
      state: 1,
      sort: 2,
    },
  ]);

  const draggableEnd = () => {
    console.log(waitDragList.value);
  };

  const itemUpdateCheck = (check: boolean, item) => {
    console.log(check, item);
  };
</script>

<template>
  <div class="wait-for-do-list">
    <div class="wait-for-do-list__search">
      <n-select v-model:value="classifyValue" :options="classifyOptions" />
    </div>
    <div class="wait-for-do-list__add">
      <n-input placeholder="添加待办事件，按回车保存">
        <template #prefix>
          <n-icon :component="PlusOutlined" color="#2d8cf0" />
        </template>
        <template #suffix>
          <n-popover v-model:show="showCalendarPop" placement="bottom" trigger="manual" @clickoutside="calendarPopOutside">
            <template #trigger>
              <div class="add-calendar" @click="showCalendarPop = !showCalendarPop">
                <n-icon :component="CalendarOutline" />
                <span v-if="deadline" class="add-time">{{ deadline }}</span>
              </div>
            </template>
            <div>
              <n-date-picker
                v-model:formatted-value="deadline"
                :format="formatText"
                :value-format="formatText"
                panel
                :actions="['clear', 'now', 'confirm']"
                type="datetime"
                @confirm="setDeadline()"
              />
            </div>
          </n-popover>
        </template>
      </n-input>
    </div>
    <n-tabs v-model:value="waitTabsName" justify-content="space-evenly" type="line">
      <n-tab-pane :name="1" tab="进行中"></n-tab-pane>
      <n-tab-pane :name="2" tab="已完成"></n-tab-pane>
    </n-tabs>
    <Draggable v-model="waitDragList" animation="300" item-key="waitForDoId" @end="draggableEnd">
      <template #item="{ element }">
        <div class="wait-list--item">
          <n-checkbox :checked="element.state === 2" size="small" @update:checked="itemUpdateCheck($event, element)" />
          <div class="item-info">
            <div class="item-text">{{ element.title }}</div>
            <div class="item-remark">{{ element.remark }}</div>
          </div>
        </div>
      </template>
    </Draggable>
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

    &__search {
      margin-bottom: 10px;
    }

    &__add {
      margin-bottom: 10px;

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

    .wait-list--item {
      cursor: default;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      display: flex;

      .item-info {
        margin-left: 10px;
      }

      .item-text {
        font-size: 14px;
        color: #333;
      }

      .item-remark {
        font-size: 12px;
        color: #999;
        max-width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>
