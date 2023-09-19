<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { RESULT_ENUM } from '@/constant';
  import { LockOutlined, LoadingOutlined, UserOutlined, ApiOutlined, ArrowRightOutlined, WifiOutlined } from '@/utils';
  import { useBattery, useOnline, useTime } from '@/hooks';
  import { useLockScreenStore, useUserStore } from '@/store';

  const useLockScreen = useLockScreenStore();
  const userStore = useUserStore();

  // 获取时间
  const { month, day, hour, minute, week } = useTime();
  const { online } = useOnline();

  const router = useRouter();
  const route = useRoute();

  const { battery, batteryStatus, calcDischargingTime, calcChargingTime } = useBattery();
  const userInfo = userStore.getUserInfo;
  const username = userInfo['username'] || '';
  const state = reactive({
    showLogin: false,
    loginLoading: false, // 正在登录
    isLoginError: false, //密码错误
    errorMsg: '密码错误',
    loginParams: {
      username: username || '',
      password: '',
    },
  });

  // 解锁登录
  const onLockLogin = (value: boolean) => (state.showLogin = value);

  // 登录
  const onLogin = async () => {
    if (!state.loginParams.password.trim()) {
      return;
    }
    const params = {
      isLock: true,
      ...state.loginParams,
    };
    state.loginLoading = true;
    const { code, message } = await userStore.login(params);
    if (code === RESULT_ENUM.SUCCESS) {
      onLockLogin(false);
      useLockScreen.setLock(false);
    } else {
      state.errorMsg = message;
      state.isLoginError = true;
    }
    state.loginLoading = false;
  };

  //重新登录
  const goLogin = () => {
    onLockLogin(false);
    useLockScreen.setLock(false);
    router.replace({
      path: '/login',
      query: {
        redirect: route.fullPath,
      },
    });
  };
</script>

<template>
  <div :class="{ onLockLogin: state.showLogin }" class="lock-screen" @keyup="onLockLogin(true)" @mousedown.stop @contextmenu.prevent>
    <template v-if="!state.showLogin">
      <div class="lock-box">
        <div class="lock">
          <span class="lock-icon" title="解锁屏幕" @click="onLockLogin(true)">
            <n-icon>
              <lock-outlined />
            </n-icon>
          </span>
        </div>
      </div>
      <!--充电-->
      <div class="lock-screen__recharge">
        <div class="number">{{ battery.level }}%</div>
        <div class="contrast">
          <div class="circle"></div>
          <ul class="bubbles">
            <li v-for="i in 15" :key="i"></li>
          </ul>
        </div>
        <div class="charging">
          <div>{{ batteryStatus }}</div>
          <div v-show="Number.isFinite(battery.dischargingTime) && battery.dischargingTime != 0">剩余可使用时间：{{ calcDischargingTime }}</div>
          <span v-show="Number.isFinite(battery.chargingTime) && battery.chargingTime != 0">距离电池充满需要：{{ calcChargingTime }}</span>
        </div>
      </div>

      <div class="local-time">
        <div class="time">{{ hour }}:{{ minute }}</div>
        <div class="date">{{ month }}月{{ day }}号，星期{{ week }}</div>
      </div>
      <div class="computer-status">
        <span :class="{ offline: !online }" class="network">
          <wifi-outlined class="network" />
        </span>
        <api-outlined />
      </div>
    </template>

    <!--登录-->
    <template v-if="state.showLogin">
      <div class="login-box">
        <n-avatar :size="128">
          <n-icon>
            <user-outlined />
          </n-icon>
        </n-avatar>
        <div class="username">{{ state.loginParams.username }}</div>
        <n-input v-model:value="state.loginParams.password" type="password" autofocus placeholder="请输入登录密码" @keyup.enter="onLogin">
          <template #suffix>
            <n-icon style="cursor: pointer" @click="onLogin">
              <LoadingOutlined v-if="state.loginLoading" />
              <arrow-right-outlined v-else />
            </n-icon>
          </template>
        </n-input>

        <div v-if="state.isLoginError" class="w-full flex">
          <span class="text-red-500">{{ state.errorMsg }}</span>
        </div>

        <div class="w-full mt-1 flex justify-around">
          <div><a @click="state.showLogin = false">返回</a></div>
          <div><a @click="goLogin">重新登录</a></div>
          <div><a @click="onLogin">进入系统</a></div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .lock-screen {
    @keyframes rotate {
      50% {
        border-radius: 45% / 42% 38% 58% 49%;
      }

      100% {
        transform: translate(-50%, -50%) rotate(720deg);
      }
    }

    @keyframes hue-rotate {
      100% {
        filter: contrast(15) hue-rotate(360deg);
      }
    }

    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    overflow: hidden;
    color: white;
    background: #000;

    &__recharge {
      position: absolute;
      bottom: 20vh;
      left: 50vw;
      width: 300px;
      height: 500px;
      transform: translateX(-50%);

      .number {
        position: absolute;
        top: 20%;
        z-index: 10;
        width: 300px;
        color: #fff;
        font-size: 32px;
        text-align: center;
      }

      .contrast {
        width: 300px;
        height: 400px;
        overflow: hidden;
        background-color: #000;
        filter: contrast(15) hue-rotate(0);
        animation: hue-rotate 10s infinite linear;

        .circle {
          position: relative;
          box-sizing: border-box;
          width: 300px;
          height: 300px;
          filter: blur(8px);

          &::after {
            position: absolute;
            top: 40%;
            left: 50%;
            width: 200px;
            height: 200px;
            background-color: #00ff6f;
            border-radius: 42% 38% 62% 49% / 45%;
            transform: translate(-50%, -50%) rotate(0);
            animation: rotate 10s infinite linear;
            content: '';
          }

          &::before {
            position: absolute;
            top: 40%;
            left: 50%;
            z-index: 10;
            width: 176px;
            height: 176px;
            background-color: #000;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            content: '';
          }
        }

        .bubbles {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 100px;
          height: 40px;
          background-color: #00ff6f;
          border-radius: 100px 100px 0 0;
          transform: translate(-50%, 0);
          filter: blur(5px);

          li {
            position: absolute;
            background: #00ff6f;
            border-radius: 50%;
          }
        }
      }

      .charging {
        font-size: 20px;
        text-align: center;
      }
    }

    &.onLockLogin {
      background-color: rgb(25 28 34 / 88%);
      backdrop-filter: blur(7px);
    }

    .login-box {
      position: absolute;
      top: 45%;
      left: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);

      > * {
        margin-bottom: 14px;
      }

      .username {
        font-size: 30px;
      }
    }

    .lock-box {
      position: absolute;
      top: 20px;
      left: 50%;
      z-index: 100;
      font-size: 34px;
      transform: translateX(-50%);

      .tips {
        color: white;
        cursor: text;
      }

      .lock {
        display: flex;
        justify-content: center;

        .lock-icon {
          cursor: pointer;

          .anticon-unlock {
            display: none;
          }

          &:hover .anticon-unlock {
            display: initial;
          }

          &:hover .anticon-lock {
            display: none;
          }
        }
      }
    }

    .local-time {
      position: absolute;
      bottom: 60px;
      left: 60px;
      font-family: helvetica, sans-serif;

      .time {
        font-size: 70px;
      }

      .date {
        font-size: 40px;
      }
    }

    .computer-status {
      position: absolute;
      right: 60px;
      bottom: 60px;
      font-size: 24px;

      > * {
        margin-left: 14px;
      }

      .network {
        position: relative;

        &.offline::before {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 10;
          width: 2px;
          height: 28px;
          background-color: red;
          transform: translate(-50%, -50%) rotate(45deg);
          content: '';
        }
      }
    }
  }
</style>
