import { nextTick, reactive, ref } from 'vue';
import { UserItemForm } from '/#/api/user';
import { FormItemRule } from 'naive-ui';
import { getImgUrl } from '@/utils';
import { capitalApi, roleApi, userApi } from '@/api';
import { CStrOption } from '/#/common/config';

// 用户管理 新建/修改 传参
// export const UserAddUpdateModelProps = {};

// 默认表单
const defaultModelForm = {
  nickname: null,
  avatar: [],
  username: null,
  roleCode: null,
  password: null,
  verifyPassword: null,
};

// 用户管理 新建/修改 弹窗
export const useUserAddUpdateModel = (emit: (event: 'refresh', ...args: any[]) => void) => {
  const modelId = ref('');
  const showModal = ref(false);

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive<UserItemForm>(Object.assign({}, defaultModelForm));
  // 验证用户名
  const validateUsername = (_rule: FormItemRule, value: string) => {
    if (!value) return new Error('请输入用户名');
    else if (!/^[a-z][a-z_`~@*|()+-]{3,40}$/.test(value)) return new Error('用户名不符合规定');
    return true;
  };
  // 判断正在输入的密码是否输入
  const validatePasswordStartWith = (_rule: FormItemRule, value: string) =>
    modelForm.password && modelForm.password.startsWith(value) && modelForm.password.length >= value.length;
  // 判断输入完成的密码是否完全相同
  const validatePasswordSame = (_rule: FormItemRule, value: string) => value === modelForm.password;
  const modelRules = reactive({
    nickname: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入角色昵称`,
    },
    username: {
      required: true,
      validator: validateUsername,
      trigger: ['blur', 'input'],
    },
    roleCode: {
      required: true,
      trigger: ['blur', 'change'],
      message: `请选择角色标识`,
    },
    password: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入密码`,
    },
    verifyPassword: [
      {
        required: true,
        message: '请再次输入密码',
        trigger: ['input', 'blur'],
      },
      {
        validator: validatePasswordStartWith,
        message: '两次密码输入不一致',
        trigger: 'input',
      },
      {
        validator: validatePasswordSame,
        message: '两次密码输入不一致',
        trigger: ['blur', 'password-input'],
      },
    ],
  });

  // 角色列表
  const roleOption = ref<CStrOption[]>([]);

  // 初始化
  const init = (row: any) => {
    showModal.value = true;
    modelId.value = row?.userId;
    resetFields();
    if (modelId.value) {
      modelForm.nickname = row.nickname;
      modelForm.avatar = row.avatar
        ? [
            {
              url: getImgUrl(row.avatar),
              key: row.avatar,
              status: 'finished',
            },
          ]
        : [];
      modelForm.username = row.username;
      modelForm.roleCode = row.roleCode;
    }
    nextTick(() => {
      roleApi.getAll().then((res) => {
        roleOption.value = res.map((m: any) => ({ label: m.name, value: m.roleCode }));
      });
    });
  };
  // 重置
  const resetFields = () => {
    Object.assign(modelForm, defaultModelForm);
    nextTick(() => {
      modelFromRef.value.restoreValidation();
    });
  };

  // 提交
  const confirmForm = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    formBtnLoading.value = true;
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        const request = modelId.value
          ? userApi.updateRoleCode({ userId: modelId.value, roleCode: modelForm.roleCode || '' })
          : capitalApi.signUp({
              nickname: modelForm.nickname || '',
              avatar: modelForm.avatar.length > 0 ? modelForm.avatar[0].key : '',
              username: modelForm.username || '',
              roleCode: modelForm.roleCode || '',
              password: modelForm.verifyPassword || '',
            });
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
    roleOption,
    init,
    confirmForm,
  };
};
