import { nextTick, reactive, ref } from 'vue';
import { RoleItemForm, RoleItemFormRules } from '/#/views/role';
import { menuApi, roleApi } from '@/api';
import { ApiSwaggerJsonResult } from '/#/api/role';
import { levelMenu } from '@/utils';

// 默认表单
const defaultModelForm = {
  name: null,
  roleCode: null,
  roleType: null,
  menuPermission: [],
  apiPermission: [],
};

// 用户管理 新建/修改 弹窗
export const useRoleAddUpdateModel = (emit: (event: 'refresh', ...args: any[]) => void) => {
  const modelId = ref('');
  const showModal = ref(false);

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive<RoleItemForm>(Object.assign({}, defaultModelForm));
  const modelRules = reactive<RoleItemFormRules>({
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
      modelForm.menuPermission = defaultMenuChecked.value = row.menuPermission;
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
        .map((m) => {
          let children: ApiSwaggerJsonResult[] = [];
          if (m.children && m.children.length > 0) {
            children = m.children.filter((f) => f.jwt).map((c) => ({ ...c, key: c.operationId, label: `${c.method}__${c.summary}` }));
          }
          return {
            children,
            key: m.tagId,
            label: m.tagName,
          };
        })
        .filter((f) => f.children.length > 0);
      apiAllLoading.value = true;
    });
  };

  // 获取菜单列表
  const loadMenuList = () => {
    menuApi.getMenuList().then((res) => {
      menuData.value = levelMenu(res);
      menuListLoading.value = true;
    });
  };
  // 重置
  const resetFields = () => {
    Object.assign(modelForm, defaultModelForm);
    nextTick(() => {
      modelFromRef.value.restoreValidation();
    });
  };

  // 菜单权限选择树
  const updateMenuChecked = (values: any) => {
    modelForm.menuPermission = values;
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
          menuPermission: modelForm.menuPermission,
          apiPermission: modelForm.apiPermission,
        };
        const request = modelId.value ? roleApi.update({ roleId: modelId.value, ...params }) : roleApi.save(params);
        request.then(() => {
          showModal.value = false;
          emit('refresh');
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
};
