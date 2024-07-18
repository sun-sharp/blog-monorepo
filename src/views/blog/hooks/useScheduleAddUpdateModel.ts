import { computed, nextTick, reactive, ref, unref } from 'vue';
import { FormItemRule } from 'naive-ui';
import { scheduleAPi } from '@/api';
import { ScheduleForm, ScheduleFormRules } from '/#/views/schedule';
import { ApiScheduleItem, ApiScheduleSaveData } from '/#/api/blog/schedule';

const modelFields = {
  title: '',
  content: '',
  // 开始日期
  startDate: null,
  // 结束日期
  endDate: null,
  // 开始时间
  startTime: null,
  // 结束时间
  endTime: null,
};

// 修改、创建银行导入 弹窗
export const useAddUpdateModel = (emit: (event: 'finish', ...args: any[]) => void) => {
  // 弹窗
  const modelId = ref('');
  const showModal = ref(false);
  const modelTitle = computed(() => (unref(modelId) ? '修改' : '新增') + '日程');

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive<ScheduleForm>(Object.assign({}, modelFields));
  const modelRules = reactive<ScheduleFormRules>({
    startDate: {
      required: true,
      trigger: ['blur', 'change'],
      message: `请选择开始日期`,
    },
    endDate: {
      required: true,
      trigger: ['blur', 'change'],
      message: `请选择结束日期`,
    },
    title: {
      required: true,
      trigger: ['blur'],
      message: `请输入标题`,
    },
    content: {
      required: true,
      trigger: ['blur'],
      message: `请输入内容`,
    },
  });

  // 初始化
  const init = (row: ApiScheduleItem) => {
    showModal.value = true;
    modelId.value = row?.scheduleId;
    resetFields();
    if (modelId.value) {
      Object.assign(modelForm, row);
      modelForm.startDate = row.startDate || null;
      modelForm.endDate = row.endDate || null;
      modelForm.startTime = row.startTime || null;
      modelForm.endTime = row.endTime || null;
    }
  };

  // 重置
  const resetFields = () => {
    Object.assign(modelForm, modelFields);
    nextTick(() => {
      modelFromRef.value.restoreValidation();
    });
  };

  // 提交
  const confirmForm = (e: MouseEvent) => {
    e.preventDefault();
    formBtnLoading.value = true;
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        const params: ApiScheduleSaveData = {
          title: modelForm.title,
          // 日程内容
          content: modelForm.content,
          // 开始日期
          startDate: modelForm.startDate || '',
          // 结束日期
          endDate: modelForm.endDate || '',
          // 开始时间
          startTime: modelForm.startTime || '',
          // 结束时间
          endTime: modelForm.endTime || '',
        };
        const request = modelId.value ? scheduleAPi.update({ scheduleId: modelId.value, ...params }) : scheduleAPi.save(params);
        request.then(() => {
          showModal.value = false;
          emit('finish');
        });
      }
      formBtnLoading.value = false;
    });
  };

  return {
    modelTitle,
    showModal,
    modelFromRef,
    modelForm,
    modelRules,
    formBtnLoading,
    init,
    confirmForm,
  };
};
