<template>
  <div class="view-account">
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img class="w-40" :src="logo" alt="" />
          <span class="ml-10">{{ title }}</span>
        </div>
        <div class="view-account-top-desc mt-20">{{ shortName }}是一个个人的博客后台管理系统</div>
      </div>
      <div class="view-account-form">
        <n-form ref="formRef" label-placement="left" size="large" :model="formInline" :rules="rules">
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" placeholder="请输入用户名" @keyup.enter="handleSubmit">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input v-model:value="formInline.password" type="password" show-password-on="click" placeholder="请输入密码" @keyup.enter="handleSubmit">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!-- <n-form-item path="isCaptcha">
            <div class="w-full">
              <mi-captcha width="384" :logo="logo" @success="onAuthCode" />
            </div>
          </n-form-item> -->
          <!-- <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="autoLogin">自动登录</n-checkbox>
              </div>
              <div class="flex-initial order-last">
                <a href="javascript:">忘记密码</a>
              </div>
            </div>
          </n-form-item> -->
          <n-form-item>
            <n-button type="primary" size="large" :loading="loading" :disabled="loading" block @click="handleSubmit">登录</n-button>
          </n-form-item>
          <!-- <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial">
                <span>其它登录方式</span>
              </div>
              <div class="flex-initial mh-10">
                <a href="javascript:">
                  <n-icon size="24">
                    <LogoGithub />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial mh-10">
                <a href="javascript:">
                  <n-icon size="24">
                    <LogoFacebook />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial" style="margin-left: auto">
                <a href="javascript:">注册账号</a>
              </div>
            </div>
          </n-form-item> -->
        </n-form>
      </div>
    </div>
    <layout-footer />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import { FormItemRule, MessageReactive, useMessage } from 'naive-ui';
  import logo from '@/assets/images/common/logo.png';
  import {
    PersonOutline,
    LockClosedOutline,
    // , LogoGithub, LogoFacebook
    isMobile,
  } from '@/utils';
  import { APP_ENV_CONFIG, RESULT_ENUM } from '@/constant';
  import LayoutFooter from '@/layout/components/LayoutFooter.vue';

  const title = APP_ENV_CONFIG.title;
  const shortName = APP_ENV_CONFIG.shortName;
  const formRef = ref();
  const message = useMessage();
  const loading = ref(false);
  // const autoLogin = ref(true);

  const formInline = reactive({
    username: '',
    password: '',
    isCaptcha: false,
  });

  const rules = {
    username: { required: true, message: '请输入用户名', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
    isCaptcha: {
      required: true,
      type: 'boolean',
      trigger: 'change',
      message: '请点击按钮进行验证码校验',
      validator: (_: unknown, value: boolean) => value === true,
    },
  };

  const userStore = useUserStore();

  const router = useRouter();
  const route = useRoute();

  // 登录提交
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    formRef.value.validate(async (errors: FormItemRule) => {
      if (!errors) {
        const { username, password } = formInline;
        let messageReactive: MessageReactive | null = message.loading('登录中...');
        loading.value = true;
        const params = {
          username,
          password,
        };
        const { code, message: msg } = await userStore.login(params);
        loading.value = false;
        if (messageReactive) {
          messageReactive.destroy();
          messageReactive = null;
        }
        if (code === RESULT_ENUM.SUCCESS) {
          message.success('登录成功！');
          if (isMobile()) {
            const path = window.location.pathname.replace('/manage', '') || '/';
            window.location.href = window.location.origin + path;
            return;
          }
          const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
          router.replace(toPath).then(() => {
            if (route.name == 'login') {
              router.replace('/');
            }
          });
        } else {
          message.error(msg || '登陆失败！');
        }
      } else {
        message.error('请填写完整信息，并且进行验证码校验');
      }
    });
  };

  // 验证码验证
  // const onAuthCode = () => {
  //   formInline.isCaptcha = true;
  // };
</script>

<style lang="scss" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    overflow: auto;

    &-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 384px;
      height: 0;
    }

    &-top {
      padding: 32px 0;
      text-align: center;

      &-desc {
        color: #808695;
        font-size: 14px;
      }

      &-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 30px;
      }
    }

    &-other {
      width: 100%;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }

  @media (width < 768px) {
    .view-account {
      padding: 0;
      background-image: none;
    }

    .view-account-container {
      width: 100%;
      max-width: 320px;
    }

    .view-account-top {
      padding: 20px 0 12px;
    }

    .view-account-top-logo {
      flex-direction: column;
      gap: 12px;
      font-size: 26px;
    }

    .view-account-top-logo img {
      width: 48px;
    }

    .view-account-top-desc {
      font-size: 15px;
      line-height: 1.4;
    }

    .view-account-form {
      width: 100%;
      padding: 0 16px;
    }

    .view-account-form :deep(.n-form-item) {
      margin-bottom: 16px;
    }

    .view-account-form :deep(.n-input) {
      font-size: 14px;
    }

    .view-account-form :deep(.n-button) {
      height: 44px;
      font-size: 16px;
    }

    .view-account-other {
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 8px;
    }

    .view-account-other > div {
      margin: 4px 8px;
    }
  }

  @media (width >=768px) {
    .view-account {
      background-image: url('@/assets/images/login/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px;
    }
  }
</style>
