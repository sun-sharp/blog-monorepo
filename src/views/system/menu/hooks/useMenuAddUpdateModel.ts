import { menuTypeObj } from '@/constant';
import { constantHtmlIcon } from '@/utils';
import { ExtractPropTypes, VNode, nextTick, reactive, ref, unref, watch } from 'vue';
import { ApiLevelMenuItem } from '/#/api/menu';
import { FormItemRule, FormRules, MenuOption } from 'naive-ui';
import { menuApi } from '@/api';

// 菜单管理 新建/修改 传参
export const MenuAddUpdateModelProps = {
  tableData: {
    type: Array,
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
};

// 菜单管理 新建/修改 弹窗
export const useMenuAddUpdateModel = (props: ExtractPropTypes<typeof MenuAddUpdateModelProps>, emit: (event: 'refurbish', ...args: any[]) => void) => {
  const modelId = ref('');
  const showModal = ref(false);

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
  });
  const parentIdOptions = ref([
    {
      menuId: '0',
      title: '根目录',
      children: props.tableData || [],
    },
  ]);
  watch(
    () => modelForm.menuType,
    (menuType) => {
      menuTypeName.value = menuTypeObj[menuType];
    }
  );
  watch(
    () => unref(props).tableData,
    (tableData) => {
      parentIdOptions.value = [
        {
          menuId: '0',
          title: '根目录',
          children: tableData || [],
        },
      ];
    }
  );
  // 图标
  const iconOptions = ref<MenuOption[]>([]);
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
    Object.assign(modelForm, defaultModelForm);
    // Object.keys(defaultModelForm).forEach((key) => {
    //   modelForm[key] = defaultModelForm[key];
    // });
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
        const params: any = {
          menuType: modelForm.menuType,
          title: modelForm.title,
          name: modelForm.name,
          icon: modelForm.icon,
          sort: modelForm.sort,
          parentId: modelForm.parentId,
          hidden: modelForm.hidden,
        };
        // 当不为次级目录，内嵌，外接
        if (![2, 6, 7].includes(modelForm.menuType)) {
          params.component = modelForm.component;
        }
        // 如果为内嵌
        if ([6].includes(modelForm.menuType)) {
          params.iframeSrc = modelForm.iframeSrc;
        }
        const request = modelId.value ? menuApi.updateMenu({ menuId: modelId.value, ...params }) : menuApi.saveMenu(params);
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
    parentIdOptions,
    iconOptions,
    iconRenderLabel,
    init,
    confirmForm,
  };
};
