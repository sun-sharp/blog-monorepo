<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" preset="dialog" :title="modelId ? '修改' : '新增'">
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
      <n-form-item v-if="modelForm.roleType === 2 && menuListLoading" label="菜单权限" path="permission">
        <n-tree
          style="width: 100%"
          block-line
          block-node
          cascade
          checkable
          key-field="name"
          label-field="title"
          :data="menuData"
          :default-expand-all="false"
          :default-checked-keys="defaultMenuChecked"
          @update:checked-keys="updateMenuChecked"
        />
      </n-form-item>
      <n-form-item v-if="modelForm.roleType === 2 && apiAllLoading" label="接口权限" path="apiPermission">
        <n-tree
          style="width: 100%"
          block-line
          block-node
          cascade
          checkable
          :data="apiAllData"
          :default-expand-all="false"
          :default-checked-keys="defaultApiChecked"
          @update:checked-keys="updateApiChecked"
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
  import { roleTypeOption } from '@/constant';

  const modelFields = {
    name: null,
    roleCode: null,
    roleType: null,
    permission: [],
    apiPermission: [],
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

      const defaultMenuChecked = ref([]);
      const menuData = ref<any[]>([]);
      const defaultApiChecked = ref([]);
      const apiAllData = ref<any[]>([]);

      // 初始化
      const menuListLoading = ref(false);
      const apiAllLoading = ref(false);
      const init = async (row: any) => {
        showModal.value = true;
        modelId.value = row?.roleId;
        menuListLoading.value = false;
        apiAllLoading.value = false;
        resetFields();
        if (modelId.value) {
          modelForm.name = row.name;
          modelForm.roleCode = row.roleCode;
          modelForm.roleType = row.roleType;
          modelForm.permission = defaultMenuChecked.value = row.permission;
          modelForm.apiPermission = defaultApiChecked.value = row.apiPermission;
        } else {
          defaultMenuChecked.value = [];
          defaultApiChecked.value = [];
        }
        nextTick(() => {
          loadMenuList();
          loadApiAll();
        });
      };

      const loadApiAll = () => {
        roleApi.getApiAll().then((res) => {
          apiAllData.value = (res || [])
            .map((m: any) => {
              let children = [];
              if (m.children && m.children.length > 0) {
                children = m.children.filter((f: any) => f.jwt).map((c: any) => ({ key: c.operationId, label: `${c.method}__${c.summary}` }));
              }
              return {
                children,
                key: m.tagId,
                label: m.tagName,
              };
            })
            .filter((f: any) => f.children.length > 0);
          apiAllLoading.value = true;
        });
      };

      // 获取菜单列表
      const loadMenuList = () => {
        menuApi.getMenuList().then((res) => {
          menuData.value = levelMenu(res);
          console.log(menuData.value, 'menuData.value');

          menuListLoading.value = true;
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
      const updateMenuChecked = (values: any) => {
        modelForm.permission = values;
      };

      // 菜单权限选择树
      const updateApiChecked = (values: any) => {
        modelForm.apiPermission = values;
      };

      // 提交
      const confirmForm = (e: any) => {
        e.preventDefault();
        formBtnLoading.value = true;
        modelFromRef.value.validate((errors: any) => {
          if (!errors) {
            const params: any = {
              name: modelForm.name,
              roleCode: modelForm.roleCode,
              roleType: modelForm.roleType,
              permission: modelForm.permission,
              apiPermission: modelForm.apiPermission,
            };
            const request = modelId.value ? roleApi.update({ roleId: modelId.value, ...params }) : roleApi.save(params);
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
        defaultMenuChecked,
        menuListLoading,
        defaultApiChecked,
        apiAllLoading,
        apiAllData,
        init,
        updateMenuChecked,
        updateApiChecked,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss"></style>
