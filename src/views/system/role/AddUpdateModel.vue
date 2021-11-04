<template>
  <n-modal v-model:show="showModal" class="menu-model w-600" :show-icon="false" preset="dialog" :title="modelId ? '修改' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="角色名称`" path="name">
        <n-input v-model:value="modelForm.name" placeholder="请输入角色名称" />
      </n-form-item>
      <n-form-item label="角色标识" path="roleCode">
        <n-input v-model:value="modelForm.roleCode" placeholder="请输入角色标识" />
      </n-form-item>
      <n-form-item label="角色权限类型" path="roleType">
        <n-select v-model:value="modelForm.roleType" :options="roleTypeOption" placeholder="请选择角色权限类型" />
      </n-form-item>
      <n-form-item v-if="modelForm.roleType === 2 && menuListLoading" label="菜单权限" path="menuList">
        <n-tree
          block-line
          block-node
          cascade
          checkable
          key-field="name"
          label-field="title"
          :data="menuData"
          :default-expand-all="true"
          :default-checked-keys="defaultCheckedKeys"
          @update:checked-keys="updateCheckedKeys"
        />
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
  import { defineComponent, nextTick, reactive, ref } from 'vue';
  import { menuApi, roleApi } from '@/api';
  import { levelMenu } from '@/utils';
  import { roleTypeOption } from '@/enums/apiEnum';

  const modelFields = {
    name: null,
    roleCode: null,
    roleType: null,
    menuList: [],
  };

  export default defineComponent({
    emits: ['refurbish'],
    setup(_props, { emit }) {
      const modelId = ref('');
      const showModal = ref(false);

      const formBtnLoading = ref(false);
      const modelFromRef = ref();
      const modelForm = reactive<any>(Object.assign({}, modelFields));
      const modelRules = reactive({
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入角色名称`,
        },
        roleCode: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入角色标识`,
        },
        roleType: {
          type: 'number',
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择角色权限类型',
        },
      });

      const defaultCheckedKeys = ref([]);
      const menuData = ref<any[]>([]);

      // 初始化
      const menuListLoading = ref(false);
      const init = async (row) => {
        showModal.value = true;
        modelId.value = row?.id;
        menuListLoading.value = false;
        resetFields();
        if (modelId.value) {
          modelForm.name = row.name;
          modelForm.roleCode = row.roleCode;
          modelForm.roleType = row.roleCode === 'manager' ? 1 : 2;
          modelForm.menuList = defaultCheckedKeys.value = row.menuList;
        } else {
          defaultCheckedKeys.value = [];
        }
        nextTick(() => {
          menuApi.getMenuList().then((res) => {
            menuData.value = levelMenu(res);
            menuListLoading.value = true;
          });
        });
      };
      // 重置
      const resetFields = () => {
        Object.keys(modelFields).forEach((key) => {
          modelForm[key] = modelFields[key];
        });
        nextTick(() => {
          modelFromRef.value.restoreValidation();
        });
      };

      // 菜单权限选择树
      const updateCheckedKeys = (values) => {
        modelForm.menuList = values;
      };

      // 提交
      const confirmForm = (e) => {
        e.preventDefault();
        formBtnLoading.value = true;
        modelFromRef.value.validate((errors) => {
          if (!errors) {
            const params: any = {
              name: modelForm.name,
              roleCode: modelForm.roleCode,
              menuList: modelForm.menuList,
            };
            const request = modelId.value ? roleApi.update({ id: modelId.value, ...params }) : roleApi.save(params);
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
        modelFromRef,
        modelForm,
        modelRules,
        formBtnLoading,
        roleTypeOption,
        menuData,
        defaultCheckedKeys,
        menuListLoading,
        init,
        updateCheckedKeys,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss"></style>
