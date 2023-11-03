import { isNullOrUnDef } from '@/utils';
import { CSSProperties, ExtractPropTypes, computed, onMounted, reactive, ref, unref, watch } from 'vue';
import { ComponentType, FormActionType, FormSchema, SearchFormProps } from '/#/components/form';
import { ButtonProps, GridItemProps, GridProps } from 'naive-ui';

// 表单查询 传参
export const FormSearchProps = {
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 80,
  },
  // 表单配置规则
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
  },
  //是否展示为行内表单
  inline: {
    type: Boolean,
    default: false,
  },
  //大小
  size: {
    type: String,
    default: 'medium',
  },
  //标签位置
  labelPlacement: {
    type: String,
    default: 'left',
  },
  //组件是否width 100%
  isFull: {
    type: Boolean,
    default: true,
  },
  //是否显示操作按钮（查询）
  showActionButtonGroup: {
    type: Boolean,
    default: true,
  },
  // 显示确认按钮
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  // 确认按钮配置
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,
  //展开收起按钮
  showAdvancedButton: {
    type: Boolean,
    default: true,
  },
  // 确认按钮文字
  submitButtonText: {
    type: String,
    default: '查询',
  },
  //grid 配置
  gridProps: Object as PropType<GridProps>,
  //gi配置
  giProps: Object as PropType<GridItemProps>,
  //grid 样式
  baseGridStyle: {
    type: Object as PropType<CSSProperties>,
  },
  //是否折叠
  collapsed: {
    type: Boolean,
    default: false,
  },
  //默认展示的行数
  collapsedRows: {
    type: Number,
    default: 1,
  },
};

// 表单查询
export const useFormSearch = (props: ExtractPropTypes<typeof FormSearchProps>, emit: (event: 'submit', ...args: any[]) => void) => {
  const formModel = reactive<Recordable>({});
  const schemaRef = ref<Nullable<FormSchema[]>>(null);
  const formElRef = ref<Nullable<FormActionType>>(null);
  const gridCollapsed = ref(props.showAdvancedButton);
  const isUpdateDefault = ref(false);

  const getSubmitBtnOptions = computed(() => {
    return Object.assign(
      {
        size: props.size,
        type: 'primary',
      },
      props.submitButtonOptions
    );
  });

  const createPlaceholderMessage = (component?: ComponentType): string => {
    if (!component) return '';
    if (component === 'NInput') return '请输入';
    if (['NPicker', 'NSelect', 'NCheckbox', 'NRadio', 'NSwitch', 'NDatePicker', 'NTimePicker'].includes(component)) return '请选择';
    return '';
  };

  const getComponentProps = (schema: FormSchema): any => {
    const compProps = schema.componentProps ?? {};
    const component = schema.component;
    console.log(compProps, 'compProps');
    return {
      clearable: true,
      placeholder: createPlaceholderMessage(unref(component)),
      ...compProps,
    };
  };

  const getFormBind = computed<SearchFormProps>(() => {
    return {
      labelWidth: props.labelWidth,
      schemas: props.schemas,
      inline: props.inline,
      size: props.size,
      labelPlacement: props.labelPlacement,
    };
  });

  const getGrid = computed<GridProps>(() => {
    const { gridProps } = unref(props);
    return {
      ...gridProps,
      collapsed: gridCollapsed.value,
      responsive: 'screen',
    };
  });

  const getSchema = computed<FormSchema[]>(() => {
    const schemas = unref(schemaRef) || props.schemas;
    for (const schema of schemas) {
      const { defaultValue } = schema;
      if (defaultValue) {
        schema.defaultValue = defaultValue;
      }
    }
    return schemas;
  });

  //初始化默认值
  const initDefault = () => {
    const schemas = unref(getSchema);
    schemas.forEach((item) => {
      const { defaultValue } = item;
      if (!isNullOrUnDef(defaultValue)) {
        formModel[item.field] = defaultValue;
      }
    });
  };

  // 提交
  const handleSubmit = async (e?: Event): Promise<void> => {
    e && e.preventDefault();
    const formEl = unref(formElRef);
    if (!formEl) return;
    emit('submit', formModel);
  };

  const unfoldToggle = () => {
    gridCollapsed.value = !gridCollapsed.value;
  };

  watch(
    () => getSchema.value,
    (schema) => {
      if (unref(isUpdateDefault)) {
        return;
      }
      if (schema?.length) {
        initDefault();
        isUpdateDefault.value = true;
      }
    }
  );

  onMounted(() => {
    initDefault();
  });

  return {
    formElRef,
    formModel,
    getGrid,
    getFormBind,
    getSchema,
    getSubmitBtnOptions,
    handleSubmit,
    getComponentProps,
    unfoldToggle,
  };
};
