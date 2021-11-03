<template>
  <n-modal v-model:show="showModal" class="menu-model w-600" :show-icon="false" preset="dialog" :title="modelId ? '修改' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="类型" path="menuType">
        <n-radio-group v-model:value="modelForm.menuType" name="radiogroup">
          <n-space>
            <n-radio v-for="item in menuTypeOption" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item :label="`${menuTypeName}名称`" path="title">
        <n-input v-model:value="modelForm.title" :placeholder="`请输入${menuTypeName}名称`" />
      </n-form-item>
      <n-form-item v-if="![7].includes(modelForm.menuType)" label="路由" path="path">
        <n-input v-model:value="modelForm.path" placeholder="请输入路由" />
      </n-form-item>
      <n-form-item v-if="[7].includes(modelForm.menuType)" label="外链的链接" path="name">
        <n-input v-model:value="modelForm.name" placeholder="请输入外链的链接" />
      </n-form-item>
      <n-form-item v-else label="标识" path="name">
        <n-input v-model:value="modelForm.name" placeholder="请输入标识" />
      </n-form-item>
      <n-form-item v-if="![2, 6, 7].includes(modelForm.menuType)" label="位置" path="component">
        <n-input v-model:value="modelForm.component" placeholder="请输入位置" />
      </n-form-item>
      <n-form-item v-if="[6].includes(modelForm.menuType)" label="链接" path="iframeSrc">
        <n-input v-model:value="modelForm.iframeSrc" placeholder="请输入链接" />
      </n-form-item>
      <n-form-item label="图标" path="icon">
        <n-select v-model:value="modelForm.icon" :options="iconOptions" :render-label="iconRenderLabel" :virtual-scroll="false" placeholder="请选择"></n-select>
      </n-form-item>
      <n-form-item label="排序号" path="sort">
        <n-input-number v-model:value="modelForm.sort" class="w-full" />
      </n-form-item>
      <n-form-item label="是否隐藏" path="hidden">
        <n-switch v-model:value="modelForm.hidden" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
  import { defineComponent, h, nextTick, reactive, ref, watch } from 'vue';
  import { menuTypeObj, menuTypeOption } from '@/enums/apiEnum';
  import { constantHtmlIcon } from '@/utils/icons';
  import { saveMenu, updateMenu } from '@/api';

  const modelFields = {
    menuType: 1,
    title: '',
    path: '',
    name: '',
    component: '',
    iframeSrc: '',
    icon: null,
    sort: 0,
    parentId: '0',
    hidden: false,
  };

  export default defineComponent({
    props: {},
    emits: ['refurbish'],
    setup(props, { emit }) {
      const modelId = ref('');
      const showModal = ref(false);

      const formBtnLoading = ref(false);
      const modelFromRef = ref();
      const modelForm = reactive(Object.assign({}, modelFields));
      const menuTypeName = ref(menuTypeObj[modelForm.menuType]);
      const modelRules = reactive({
        menuType: {
          type: 'number',
          required: true,
          trigger: ['change', 'blur'],
          message: '请选择类型',
        },
        title: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入名称`,
        },
        path: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入路由`,
        },
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入标识`,
        },
        component: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入位置`,
        },
        iframeSrc: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入链接`,
        },
        icon: {
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择',
        },
        parentId: {
          required: true,
          trigger: 'change',
          message: '请输入地址',
        },
        sort: {
          type: 'number',
          required: true,
          trigger: ['blur', 'change'],
          message: '请输入排序号',
        },
      });
      watch(
        () => modelForm.menuType,
        (menuType) => {
          menuTypeName.value = menuTypeObj[menuType];
        }
      );
      // 图标
      const iconOptions = ref<any[]>([]);
      iconOptions.value = Object.keys(constantHtmlIcon).map((key) => ({
        label: constantHtmlIcon[key],
        value: key,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
        },
      }));
      const iconRenderLabel = (option) => h(option.label) || 'jjj';

      // 初始化
      const init = (row) => {
        showModal.value = true;
        modelId.value = row?._id;
        resetFields();
        if (modelId.value) {
          modelForm.menuType = row.menuType;
          modelForm.title = row.title;
          modelForm.path = row.path;
          modelForm.name = row.name;
          modelForm.component = row.component;
          modelForm.iframeSrc = row.iframeSrc;
          modelForm.icon = row.icon;
          modelForm.sort = row.sort;
          modelForm.parentId = row.parentId;
          modelForm.hidden = row.hidden;
        }
      };

      // 改变类型
      // const menuTypeChange = (e) => {

      // };
      // 重置
      const resetFields = () => {
        Object.keys(modelFields).forEach((key) => {
          modelForm[key] = modelFields[key];
        });
        nextTick(() => {
          modelFromRef.value.restoreValidation();
        });
      };

      // 提交
      const confirmForm = (e) => {
        e.preventDefault();
        formBtnLoading.value = true;
        modelFromRef.value.validate((errors) => {
          if (!errors) {
            const params: any = {
              menuType: modelForm.menuType,
              title: modelForm.title,
              name: modelForm.name,
              icon: modelForm.icon,
              sort: modelForm.sort,
              parentId: modelForm.parentId,
              hidden: modelForm.hidden,
            };
            // 当不为外接
            if (![7].includes(modelForm.menuType)) {
              params.path = modelForm.path;
            }
            // 当不为次级目录，内嵌，外接
            if (![2, 6, 7].includes(modelForm.menuType)) {
              params.component = modelForm.component;
            }
            // 如果为内嵌
            if ([6].includes(modelForm.menuType)) {
              params.iframeSrc = modelForm.iframeSrc;
            }
            const request = modelId.value ? updateMenu({ id: modelId.value, ...params }) : saveMenu(params);
            request.then(() => {
              showModal.value = false;
              emit('refurbish');
            });
          }
          formBtnLoading.value = false;
        });
      };

      return {
        modelId,
        showModal,
        menuTypeName,
        modelFromRef,
        modelForm,
        modelRules,
        formBtnLoading,
        menuTypeOption,
        iconOptions,
        iconRenderLabel,
        init,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss"></style>
