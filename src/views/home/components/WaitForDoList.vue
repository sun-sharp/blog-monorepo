<script lang="ts" setup>
  import { getWaitForDoClassifyData, useApiType } from '@/hooks';
  import { PlusOutlined, CalendarOutline, TrashOutline } from '@/utils';
  import { watch, ref, onMounted } from 'vue';
  import { waitForDoApi } from '@/api';
  import Draggable from 'vuedraggable';
  import { WaitForDoItem } from '/#/views/wait-for-do';

  // 分类选择
  const classifyValue = ref<number | null>(null);
  const { getWaitForDoClassifyOption } = useApiType();
  watch(
    getWaitForDoClassifyOption,
    (option) => {
      if (option.length > 0) {
        classifyValue.value = option[0].value;
      }
    },
    {
      immediate: true,
    }
  );

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
  const defaultWaitState = 1;
  const waitTabsName = ref(defaultWaitState);
  const waitDragList = ref([]);

  const addTitleValue = ref('');

  // 获取待办数据
  const loadWaitData = (classify: number, state: number) => {
    waitForDoApi.classifyAll(classify, state).then((data) => {
      waitDragList.value = data;
    });
  };

  const draggableEnd = () => {
    console.log(waitDragList.value);
  };

  const itemUpdateCheck = (check: boolean, item: WaitForDoItem) => {
    console.log(check, item);
  };

  // 保存
  const addWaitSave = () => {
    const addClassify: number = classifyValue.value || 1;
    const postData = {
      title: addTitleValue.value,
      classify: addClassify,
      deadline: '',
      state: defaultWaitState,
    };
    waitForDoApi.save(postData).then(() => {
      loadWaitData(addClassify, defaultWaitState);
    });
  };

  // 删除
  const delWait = () => {
    console.log('删除');
  };

  // 监听查询条件变化
  watch(
    [classifyValue, waitTabsName],
    ([classify, state]) => {
      if (classify && state) {
        loadWaitData(classify, state);
      } else if (!classify) {
        addTitleValue.value = '';
        waitTabsName.value = defaultWaitState;
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );

  onMounted(() => {
    getWaitForDoClassifyData();
  });
</script>

<template>
  <div class="wait-for-do-list">
    <div class="wait-for-do-list__search">
      <n-select v-model:value="classifyValue" :options="getWaitForDoClassifyOption" clearable />
    </div>
    <template v-if="classifyValue">
      <div class="wait-for-do-list__add">
        <n-input v-model:value="addTitleValue" placeholder="添加待办事件，按回车保存" clearable @keyup.enter="addWaitSave">
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
      <template v-if="waitDragList.length > 0">
        <Draggable v-model="waitDragList" animation="300" item-key="waitForDoId" @end="draggableEnd">
          <template #item="{ element }">
            <div class="wait-list--item">
              <div class="item-left">
                <n-checkbox :checked="element.state === 2" size="small" @update:checked="itemUpdateCheck($event, element)" />
                <div class="item-info">
                  <div class="item-text">{{ element.title }}</div>
                  <div class="item-remark">{{ element.remark }}</div>
                </div>
              </div>
              <div class="item-right">
                <n-icon class="item-right--del" :component="TrashOutline" @click="delWait" />
              </div>
            </div>
          </template>
        </Draggable>
      </template>
      <n-empty v-else description="暂无数据"></n-empty>
    </template>
    <n-empty v-else class="pv-20" description="请先选择分类类型"></n-empty>
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
      justify-content: space-between;

      &:hover {
        .item-right--del {
          display: inline-block;
        }
      }

      .item-left {
        display: flex;
      }

      .item-right {
        display: flex;
        align-items: center;

        &--del {
          cursor: pointer;
          display: none;
        }
      }

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
