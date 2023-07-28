<script lang="ts" setup>
  import { ReaderOutline, TrashOutline, CalendarOutline, RightOutlined } from '@/utils';
  import { reactive, ref } from 'vue';
  import { WaitForDoItem } from '/#/views/wait-for-do';
  import { waitForDoApi } from '@/api';
  import { useDebounceFn } from '@vueuse/core';
  import { format } from 'date-fns';

  defineProps({
    title: {
      type: String,
      default: '修改待办',
    },
    width: {
      type: Number,
      default: 360,
    },
  });
  const emits = defineEmits(['refresh']);

  const isDrawer = ref(false);
  const placement = ref('right');
  const waitForDoId = ref<string | undefined>('');
  const waitDet = reactive<Partial<WaitForDoItem>>({});

  // 待办事项-日期下拉
  const showCalendarPop = ref(false);
  const calendarPopOutside = () => {
    showCalendarPop.value = false;
  };

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
  const deadlinePicker = ref<string | null>(null);
  const setDeadline = () => {
    showCalendarPop.value = false;
    waitDet.deadline = deadlinePicker.value || undefined;
    updateOther();
  };

  // 初始化
  const init = (item?: WaitForDoItem) => {
    isDrawer.value = true;
    waitForDoId.value = item?.waitForDoId;
    loadDetail();
  };

  // 获取待办详情
  const loadDetail = () => {
    if (waitForDoId.value) {
      waitForDoApi.detail(waitForDoId.value).then((data: WaitForDoItem) => {
        waitDet.title = data.title;
        waitDet.remark = data.remark;
        waitDet.state = data.state;
        waitDet.deadline = data.deadline;
        deadlinePicker.value = data.deadline || null;
      });
    }
  };

  // 修改待办的名称，备注，截止时间
  const updateOther = () => {
    if (waitForDoId.value) {
      const updateParams = {
        waitForDoId: waitForDoId.value,
        title: waitDet.title,
        remark: waitDet.remark,
        deadline: waitDet.deadline,
      };
      waitForDoApi.update(updateParams).then(() => {
        loadDetail();
        emits('refresh');
      });
    }
  };

  // 防抖的修改
  const debounceUpdate = useDebounceFn(updateOther, 300);

  // 输入修改名称
  const inputUpdateChange = () => {
    debounceUpdate();
  };

  // 点击多选框修改状态
  const itemUpdateCheck = (check: boolean) => {
    if (waitForDoId.value) {
      const updateParams = {
        waitForDoId: waitForDoId.value,
        state: check ? 2 : 1,
      };
      waitForDoApi.updateState(updateParams).then(() => {
        loadDetail();
        emits('refresh');
      });
    }
  };

  // 删除
  const delWait = () => {
    if (waitForDoId.value) {
      waitForDoApi.remove(waitForDoId.value).then(() => {
        isDrawer.value = false;
        emits('refresh');
      });
    }
  };

  defineExpose({
    init,
  });
</script>

<template>
  <n-drawer v-model:show="isDrawer" class="wait-for-do-setting" :width="width" :placement="placement">
    <n-drawer-content>
      <template #header>
        <div class="wait-for-do-setting__head">
          <span>{{ title }}</span>
          <n-icon class="head-del" :component="TrashOutline" @click.stop="delWait" />
        </div>
      </template>
      <div class="wait-for-do-setting__cont">
        <n-input v-model:value="waitDet.title" placeholder="添加待办事件" @update:value="inputUpdateChange">
          <template #prefix>
            <n-checkbox
              :style="{
                '--n-color-checked': '#ccc',
                '--n-border-checked': '1px solid #ccc',
                '--n-border-focus': '1px solid #ccc',
                '--n-box-shadow-focus': 0,
                marginRight: '5px',
              }"
              :checked="waitDet.state === 2"
              size="small"
              @update:checked="itemUpdateCheck"
              @click.stop
            />
          </template>
        </n-input>
        <div class="cont-item cont-item--bottom-border mt-5">
          <div class="cont-item--left">
            <n-icon class="mr-10" :component="CalendarOutline" size="18" />
            <span>到期日</span>
          </div>
          <div class="cont-item--right">
            <n-popover v-model:show="showCalendarPop" placement="bottom" trigger="manual" :show-arrow="false" @clickoutside="calendarPopOutside">
              <template #trigger>
                <div class="trigger-calendar" @click="showCalendarPop = !showCalendarPop">
                  <span>{{ waitDet.deadline || '未设置' }}</span>
                  <n-icon class="ml-3" :component="RightOutlined" size="18" />
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
          </div>
        </div>
        <div class="cont-item">
          <n-icon class="mr-10" :component="ReaderOutline" size="20" />
          <n-input
            v-model:value="waitDet.remark"
            :style="{
              '--n-border': 0,
              '--n-border-disabled': 0,
              '--n-border-hover': 0,
              '--n-border-focus': 0,
              '--n-box-shadow-focus': 0,
            }"
            type="textarea"
            :autosize="{
              minRows: 1,
              maxRows: 5,
            }"
            placeholder="添加备注"
            @update:value="inputUpdateChange"
          />
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss">
  .wait-for-do-setting {
    .n-drawer-header__main {
      width: 100%;
    }
    &__head {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .head-del {
        cursor: pointer;
      }
    }

    &__cont {
      .cont-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;

        &--left,
        &--right {
          display: flex;
          align-items: center;
        }

        &--right {
          cursor: pointer;

          .trigger-calendar {
            display: flex;
            align-items: center;
            color: #999;
          }
        }

        &--bottom-border {
          border-bottom: 1px solid $border-divide-color;
        }
      }
    }
  }
</style>
