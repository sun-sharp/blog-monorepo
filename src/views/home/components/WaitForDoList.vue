<script lang="ts" setup>
  import { getWaitForDoClassifyData, useApiType } from '@/hooks';
  import { PlusOutlined, CalendarOutline, isDateFormat, judgeRangeToFormatFutureTime } from '@/utils';
  import { watch, ref, onMounted } from 'vue';
  import { waitForDoApi } from '@/api';
  import Draggable from 'vuedraggable';
  import WaitForDoSetting from './WaitForDoSetting.vue';
  import { format } from 'date-fns';
  import { ApiWaitForDoItem } from '/#/api/wait-for-do';

  const waitForDoSettingRef = ref();

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
  // 禁止选中今天以前的时间
  const deadlineDateDisabled = (ts: number) => ts < new Date().getTime() - 24 * 60 * 60 * 1000;
  const deadlineTimeDisabled = (ts: number) => {
    return {
      isHourDisabled: (hour: number) => {
        return format(new Date(ts), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && hour <= new Date().getHours();
      },
      isMinuteDisabled: (minute: number) => (minute === 0 ? false : true),
      isSecondDisabled: (second: number) => (second === 0 ? false : true),
    };
  };
  const deadlinePicker = ref(null);
  const waitDeadline = ref();
  const setDeadline = () => {
    showCalendarPop.value = false;
    waitDeadline.value = deadlinePicker.value || undefined;
  };

  // 待办事项-日期下拉
  const showCalendarPop = ref(false);
  const calendarPopOutside = () => {
    showCalendarPop.value = false;
  };

  // 判断时间是否超出今天
  const expireJudge = (str: string): boolean => {
    return isDateFormat(str) && new Date(str).getTime() < Date.now();
  };

  // 处理截止时间展示
  const formatDeadline = (str: string) => {
    return str ? judgeRangeToFormatFutureTime(str) : '';
  };

  // 状态展示
  const defaultWaitState = 1;
  const waitTabsName = ref(defaultWaitState);
  const waitDragList = ref<ApiWaitForDoItem[]>([]);
  const addTitleValue = ref('');

  // 获取待办数据
  const loadWaitData = (classify: number, state: number) => {
    waitForDoApi.classifyAll(classify, state).then((data: ApiWaitForDoItem[]) => {
      waitDragList.value = data;
    });
  };

  // 刷新数据
  const refreshLoadData = () => {
    const classify: number = classifyValue.value || 1;
    loadWaitData(classify, waitTabsName.value);
  };

  // 点击列表
  const itemClick = (item: ApiWaitForDoItem) => {
    waitForDoSettingRef.value.init(item);
  };

  // 拖拽修改排序
  const draggableEnd = () => {
    const paramsArr = waitDragList.value.map((m: ApiWaitForDoItem) => ({
      waitForDoId: m.waitForDoId,
    }));
    waitForDoApi.updateSort(paramsArr).then(() => {
      refreshLoadData();
    });
  };

  // 点击多选框修改状态
  const itemUpdateCheck = (check: boolean, item: ApiWaitForDoItem) => {
    const updateParams = {
      waitForDoId: item.waitForDoId,
      state: check ? 2 : 1,
    };
    waitForDoApi.updateState(updateParams).then(() => {
      loadWaitData(item.classify, item.state);
    });
  };

  // 保存
  const addWaitSave = () => {
    const addClassify: number = classifyValue.value || 1;
    const postData = {
      title: addTitleValue.value,
      classify: addClassify,
      deadline: waitDeadline.value,
      state: defaultWaitState,
    };
    waitForDoApi.save(postData).then(() => {
      addTitleValue.value = '';
      loadWaitData(addClassify, defaultWaitState);
    });
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
    <div class="wait-for-do-list__search ph-15">
      <n-select v-model:value="classifyValue" :options="getWaitForDoClassifyOption" clearable />
    </div>
    <template v-if="classifyValue">
      <div class="wait-for-do-list__add ph-15">
        <n-input v-model:value="addTitleValue" placeholder="添加待办事件，按回车保存" clearable @keyup.enter="addWaitSave">
          <template #prefix>
            <n-icon :component="PlusOutlined" color="#2d8cf0" />
          </template>
          <template #suffix>
            <n-popover v-model:show="showCalendarPop" placement="bottom" trigger="manual" @clickoutside="calendarPopOutside">
              <template #trigger>
                <div class="add-calendar" @click="showCalendarPop = !showCalendarPop">
                  <n-icon :component="CalendarOutline" />
                  <span v-if="waitDeadline" class="add-time">{{ waitDeadline }}</span>
                </div>
              </template>
              <div>
                <n-date-picker
                  v-model:formatted-value="deadlinePicker"
                  :format="formatText"
                  :value-format="formatText"
                  :is-date-disabled="deadlineDateDisabled"
                  :is-time-disabled="deadlineTimeDisabled"
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
      <n-tabs v-model:value="waitTabsName" justify-content="space-evenly" type="line" class="ph-15">
        <n-tab-pane :name="1" tab="进行中"></n-tab-pane>
        <n-tab-pane :name="2" tab="已完成"></n-tab-pane>
      </n-tabs>
      <template v-if="waitDragList.length > 0">
        <div class="wait-drag ph-15">
          <Draggable v-model="waitDragList" animation="300" item-key="waitForDoId" @end="draggableEnd">
            <template #item="{ element }">
              <div class="wait-list--item" @click="itemClick(element)">
                <div class="item-left">
                  <n-checkbox
                    :style="{ '--n-color-checked': '#ccc', '--n-border-checked': '1px solid #ccc', '--n-border-focus': '1px solid #ccc' }"
                    :checked="element.state === 2"
                    size="small"
                    @update:checked="itemUpdateCheck($event, element)"
                    @click.stop
                  />
                  <div :class="['item-info', { finish: element.state === 2 }]">
                    <div class="item-text">{{ element.title }}</div>
                    <div class="item-remark">{{ element.remark }}</div>
                  </div>
                </div>
                <div class="item-right">
                  <div :class="['item-deadline', { expire: expireJudge(element.deadline) }]">{{ formatDeadline(element.deadline) }}</div>
                </div>
              </div>
            </template>
          </Draggable>
        </div>
      </template>
      <n-empty v-else description="暂无数据"></n-empty>
    </template>
    <n-empty v-else class="pv-20" description="请先选择分类类型"></n-empty>
    <!-- 项目配置 -->
    <wait-for-do-setting ref="waitForDoSettingRef" @refresh="refreshLoadData" />
  </div>
</template>

<style lang="scss">
  .wait-for-do-list {
    min-width: 500px;
    max-width: 800px;
    padding: 10px 5px;
    background-color: $card-background-color;
    border-radius: $card-border-radius;
    box-shadow: $card-box-shadow;

    &__search {
      margin-bottom: 10px;
    }

    &__add {
      margin-bottom: 10px;

      .add-calendar {
        display: flex;
        align-items: center;
        color: #c2c2c2;
        cursor: pointer;
      }

      .add-time {
        margin-left: 10px;
        font-size: 14px;
      }
    }

    .wait-drag {
      max-height: 240px;
      overflow-y: auto;
    }

    .wait-list--item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      cursor: default;

      .item-left {
        display: flex;
      }

      .item-right {
        display: flex;
      }

      .item-deadline {
        color: #999;

        &.expire {
          color: $text-warning-color;
        }
      }

      .item-text {
        color: #333;
        font-size: 14px;
      }

      .item-info {
        margin-left: 10px;

        &.finish {
          .item-text {
            color: #999;
          }
        }
      }

      .item-remark {
        max-width: 200px;
        overflow: hidden;
        color: #999;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>
