<template>
  <n-form v-bind="getFormBind" ref="formElRef" :model="formModel">
    <n-grid v-bind="getGrid">
      <n-gi v-for="schema in getSchema" v-bind="schema.giProps" :key="schema.field">
        <n-form-item :label="schema.label" :label-width="schema.labelWidth" :path="schema.field">
          <!--标签名右侧温馨提示-->
          <template v-if="schema.labelMessage" #label>
            {{ schema.label }}
            <n-tooltip trigger="hover" :style="schema.labelMessageStyle">
              <template #trigger>
                <n-icon size="18" class="cursor-pointer text-gray-400">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ schema.labelMessage }}
            </n-tooltip>
          </template>

          <!--判断插槽-->
          <template v-if="schema.slot">
            <slot :name="schema.slot" :model="formModel" :field="schema.field" :value="formModel[schema.field]"></slot>
          </template>

          <!--NCheckbox-->
          <template v-else-if="schema.component === 'NCheckbox'">
            <n-checkbox-group v-model:value="formModel[schema.field]">
              <n-space>
                <n-checkbox v-for="item in schema.componentProps.options" :key="item.value" :value="item.value" :label="item.label" />
              </n-space>
            </n-checkbox-group>
          </template>

          <!--NRadioGroup-->
          <template v-else-if="schema.component === 'NRadioGroup'">
            <n-radio-group v-model:value="formModel[schema.field]">
              <n-space>
                <n-radio v-for="item in schema.componentProps.options" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </template>
          <!--动态渲染表单组件-->
          <component
            v-bind="getComponentProps(schema)"
            :is="schema.component"
            v-else
            v-model:value="formModel[schema.field]"
            :class="{ isFull: schema.isFull != false && isFull }"
          />
          <!--组件后面的内容-->
          <template v-if="schema.suffix">
            <slot :name="schema.suffix" :model="formModel" :field="schema.field" :value="formModel[schema.field]"></slot>
          </template>
        </n-form-item>
      </n-gi>
      <!--提交 重置 展开 收起 按钮-->
      <n-gi v-if="showActionButtonGroup" :suffix="true" #="{ overflow }">
        <n-form-item class="form-item-right">
          <n-space align="center" justify="end" :style="{ 'margin-left': 12 }">
            <n-button v-if="showSubmitButton" v-bind="getSubmitBtnOptions" @click="handleSubmit">
              {{ submitButtonText }}
            </n-button>
            <n-button v-if="showAdvancedButton" type="primary" text icon-placement="right" @click="unfoldToggle">
              <template #icon>
                <n-icon v-if="overflow" size="14" class="unfold-icon">
                  <DownOutlined />
                </n-icon>
                <n-icon v-else size="14" class="unfold-icon">
                  <UpOutlined />
                </n-icon>
              </template>
              {{ overflow ? '展开' : '收起' }}
            </n-button>
          </n-space>
        </n-form-item>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts">
  import { computed, CSSProperties, defineComponent, onMounted, reactive, ref, unref, watch } from 'vue';
  import { ComponentType, FormActionType, SearchFormProps, FormSchema } from '/#/components/form';
  import { DownOutlined, UpOutlined, QuestionCircleOutlined, propTypes, isNullOrUnDef } from '@/utils';
  import type { ButtonProps } from 'naive-ui/lib/button';
  import type { GridItemProps, GridProps } from 'naive-ui/lib/grid';

  export default defineComponent({
    name: 'AppSearchForm',
    components: { DownOutlined, UpOutlined, QuestionCircleOutlined },
    props: {
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
      showActionButtonGroup: propTypes.bool.def(true),
      // 显示确认按钮
      showSubmitButton: propTypes.bool.def(true),
      // 确认按钮配置
      submitButtonOptions: Object as PropType<Partial<ButtonProps>>,
      //展开收起按钮
      showAdvancedButton: propTypes.bool.def(true),
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
    },
    emits: ['submit'],
    setup(props, { emit }) {
      const formModel = reactive<Recordable>({});
      const schemaRef = ref<Nullable<FormSchema[]>>(null);
      const formElRef = ref<Nullable<FormActionType>>(null);
      const gridCollapsed = ref(true);
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

      const createPlaceholderMessage = (component: ComponentType) => {
        if (component === 'NInput') return '请输入';
        if (['NPicker', 'NSelect', 'NCheckbox', 'NRadio', 'NSwitch', 'NDatePicker', 'NTimePicker'].includes(component)) return '请选择';
        return '';
      };

      const getComponentProps = (schema) => {
        const compProps = schema.componentProps ?? {};
        const component = schema.component;
        return {
          clearable: true,
          placeholder: createPlaceholderMessage(unref(component)),
          ...compProps,
        };
      };

      const getFormBind = computed((): SearchFormProps => {
        return {
          labelWidth: props.labelWidth,
          schemas: props.schemas,
          inline: props.inline,
          size: props.size,
          labelPlacement: props.labelPlacement,
        };
      });

      const getGrid = computed((): GridProps => {
        const { gridProps } = unref(props);
        return {
          ...gridProps,
          collapsed: gridCollapsed.value,
          responsive: 'screen',
        };
      });

      const getSchema: any = computed((): FormSchema[] => {
        const schemas: FormSchema[] = unref(schemaRef) || (props.schemas as any);
        for (const schema of schemas) {
          const { defaultValue } = schema;
          if (defaultValue) {
            schema.defaultValue = defaultValue;
          }
        }
        return schemas as FormSchema[];
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
    },
  });
</script>

<style lang="scss" scoped>
  .isFull {
    width: 100%;
    justify-content: flex-start;
  }

  .unfold-icon {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: -3px;
  }

  .form-item-right {
    :deep(.n-form-item-blank) {
      justify-content: flex-end;
    }
  }
</style>
