import { MAIN_DIRECTORY_VALUE, PAGE_ENUM, menuTypeObj } from '@/constant';
import { constantHtmlIcon } from '@/utils';
import { ExtractPropTypes, VNode, computed, nextTick, reactive, ref, unref, watch } from 'vue';
import { ApiLevelMenuItem, ApiMenuSaveData } from '/#/api/menu';
import { FormItemRule, FormRules } from 'naive-ui';
import { menuApi } from '@/api';
import { useRoute, useRouter } from 'vue-router';
import { useRouteStore } from '@/store';

// 菜单管理 新建/修改 传参
export const MenuAddUpdateModelProps = {
  tableData: {
    type: Array as PropType<ApiLevelMenuItem[]>,
    default: () => [],
  },
};

// 默认表单
const defaultModelForm = {
  menuType: 1,
  title: '',
  name: '',
  component: '',
  iframeSrc: '',
  icon: '',
  sort: 0,
  parentId: '0',
  hidden: false,
  keepAlive: false,
  menuConfigSystem: ['manage'],
  detConfigSystem: [] as string[],
  detName: '',
  detComponent: '',
};

// 获取菜单级别数据
const getMenuDirectory = (tableData: ApiLevelMenuItem[]): ApiLevelMenuItem[] => {
  return tableData
    .filter((f) => f.menuType === MAIN_DIRECTORY_VALUE)
    .map((m) => {
      const { children = [], ...other } = m;
      const it: ApiLevelMenuItem = { ...other };
      if (children.filter((f) => f.menuType === MAIN_DIRECTORY_VALUE).length > 0) {
        it.children = getMenuDirectory(children);
      }
      return it;
    });
};

// 菜单管理 新建/修改 弹窗
export const useMenuAddUpdateModel = (props: ExtractPropTypes<typeof MenuAddUpdateModelProps>) => {
  const modelId = ref('');
  const showModal = ref(false);

  const router = useRouter();
  const route = useRoute();

  const routeStore = useRouteStore();

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive(Object.assign({}, defaultModelForm));
  const menuTypeName = ref(menuTypeObj[modelForm.menuType]);
  const modelRules = reactive<FormRules>({
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
    // icon: {
    //   required: true,
    //   trigger: ['blur', 'change'],
    //   message: '请选择',
    // },
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
    detName: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入详情标识`,
    },
    detComponent: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入详情位置`,
    },
  });
  const parentIdOptions = computed(() => {
    const parentChildren = getMenuDirectory(props.tableData);
    return [
      {
        menuId: '0',
        title: '根目录',
        children: parentChildren,
      },
    ];
  });
  watch(
    () => modelForm.menuType,
    (menuType) => {
      menuTypeName.value = menuTypeObj[menuType];
    }
  );

  // 图标
  interface IconOption {
    label: any;
    value: string;
    style: {
      display: string;
      alignItems: string;
      justifyContent: string;
      fontSize: string;
    };
  }
  const iconOptions = ref<IconOption[]>([]);
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

  const iconRenderLabel = (option: { label: VNode }) => option.label || '';

  // 初始化
  const init = (row: ApiLevelMenuItem) => {
    showModal.value = true;
    modelId.value = row?.menuId;
    resetFields();
    if (modelId.value) {
      modelForm.menuType = row.menuType;
      modelForm.title = row.title;
      modelForm.name = row.name;
      modelForm.component = row.component || '';
      modelForm.iframeSrc = row.iframeSrc || '';
      modelForm.icon = row.icon || '';
      modelForm.sort = row.sort;
      modelForm.parentId = row.parentId;
      modelForm.hidden = row.hidden;
      modelForm.keepAlive = row.keepAlive || false;
      modelForm.menuConfigSystem = row.menuConfigSystem ? row.menuConfigSystem.split(',') : ['manage'];
      modelForm.detConfigSystem = row.detConfigSystem ? row.detConfigSystem.split(',') : [];
      modelForm.detName = row.detName || '';
      modelForm.detComponent = row.detComponent || '';
    }
  };

  // 重置
  const resetFields = () => {
    Object.assign(modelForm, defaultModelForm);
    nextTick(() => {
      modelFromRef.value.restoreValidation();
    });
  };

  // 提交
  const confirmForm = (e: Event) => {
    e.preventDefault();
    formBtnLoading.value = true;
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        const params: ApiMenuSaveData = {
          menuType: modelForm.menuType,
          title: modelForm.title,
          name: modelForm.name,
          icon: modelForm.icon,
          sort: modelForm.sort,
          parentId: modelForm.parentId,
          hidden: modelForm.hidden,
          keepAlive: modelForm.keepAlive,
        };
        // 当不为次级目录，内嵌，外接
        if (![2, 6, 7].includes(modelForm.menuType)) {
          params.component = modelForm.component;
        }
        // 如果为内嵌
        if ([6].includes(modelForm.menuType)) {
          params.iframeSrc = modelForm.iframeSrc;
        }
        // 菜单配置系统
        if (modelForm.menuConfigSystem && modelForm.menuConfigSystem.length > 0) {
          params.menuConfigSystem = modelForm.menuConfigSystem.join(',');
        }
        // 详情配置系统
        if (modelForm.detConfigSystem && modelForm.detConfigSystem.length > 0) {
          params.detConfigSystem = modelForm.detConfigSystem.join(',');
          params.detName = modelForm.detName;
          params.detComponent = modelForm.detComponent;
        }
        const request = modelId.value ? menuApi.updateMenu({ menuId: modelId.value, ...params }) : menuApi.saveMenu(params);
        request.then(() => {
          showModal.value = false;
          // 重新刷新
          routeStore.setDynamicAddedRoute(false);
          router.push({
            path: PAGE_ENUM.REDIRECT_PATH + unref(route).fullPath,
          });
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
    parentIdOptions,
    iconOptions,
    iconRenderLabel,
    init,
    confirmForm,
  };
};
