<script lang="ts" setup>
  import { DownOutlined, QuestionCircleOutlined, UpOutlined } from '@/utils';
  import { FormSearchEmits, FormSearchProps, useFormSearch } from './hooks/useFormSearch';

  const props = defineProps(FormSearchProps);

  const emit = defineEmits([FormSearchEmits]);

  const { formElRef, formModel, getGrid, getFormBind, getSchema, getSubmitBtnOptions, handleSubmit, getComponentProps, unfoldToggle } = useFormSearch(
    props,
    emit
  );
</script>

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
                <n-checkbox
                  v-for="item in schema.componentProps ? schema.componentProps.options : []"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </template>

          <!--NRadioGroup-->
          <template v-else-if="schema.component === 'NRadioGroup'">
            <n-radio-group v-model:value="formModel[schema.field]">
              <n-space>
                <n-radio v-for="item in schema.componentProps ? schema.componentProps.options : []" :key="item.value" :value="item.value">
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

<style lang="scss" scoped>
  .isFull {
    justify-content: flex-start;
    width: 100%;
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
