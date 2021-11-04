<template>
  <div class="console">
    <!--数据卡片-->
    <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <n-card title="访问量" :segmented="{ content: 'hard', footer: 'hard' }" size="small" :bordered="false">
          <template #header-extra>
            <n-tag type="success">日</n-tag>
          </template>
          <div class="p-3 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <count-to v-else :start-val="1" :end-val="visits.dayVisits" class="f-sz-30 lh-40" />
          </div>
          <div class="p-3 flex justify-between">
            <div>
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                日同比
                <count-to :start-val="1" suffix="%" :end-val="visits.rise" />
                <n-icon size="12" color="#00ff6f">
                  <CaretUpOutlined />
                </n-icon>
              </template>
            </div>
            <div>
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                周同比
                <count-to :start-val="1" suffix="%" :end-val="visits.decline" />
                <n-icon size="12" color="#ffde66">
                  <CaretDownOutlined />
                </n-icon>
              </template>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <n-skeleton v-if="loading" text :repeat="2" />
              <template v-else>
                <div>总访问量：</div>
                <div>
                  <count-to :start-val="1" :end-val="visits.amount" />
                </div>
              </template>
            </div>
          </template>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="销售额" :segmented="{ content: 'hard', footer: 'hard' }" size="small" :bordered="false">
          <template #header-extra>
            <n-tag type="info">周</n-tag>
          </template>
          <div class="p-3 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <count-to v-else prefix="￥" :start-val="1" :end-val="saleroom.weekSaleroom" class="f-sz-30 lh-40" />
          </div>
          <div class="p-6 flex justify-between">
            <div class="text-sn flex-1">
              <n-progress type="line" :percentage="saleroom.degree" :indicator-placement="'inside'" processing />
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                <div>总销售额：</div>
                <div>
                  <count-to prefix="￥" :start-val="1" :end-val="saleroom.amount" />
                </div>
              </template>
            </div>
          </template>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="订单量" :segmented="{ content: 'hard', footer: 'hard' }" size="small" :bordered="false">
          <template #header-extra>
            <n-tag type="warning">周</n-tag>
          </template>
          <div class="p-3 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <count-to v-else :start-val="1" :end-val="orderLarge.weekLarge" class="f-sz-30 lh-40" />
          </div>
          <div class="p-3 flex justify-between">
            <div>
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                日同比
                <count-to :start-val="1" suffix="%" :end-val="orderLarge.rise" />
                <n-icon size="12" color="#00ff6f">
                  <CaretUpOutlined />
                </n-icon>
              </template>
            </div>
            <div>
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                周同比
                <count-to :start-val="1" suffix="%" :end-val="orderLarge.rise" />
                <n-icon size="12" color="#ffde66">
                  <CaretDownOutlined />
                </n-icon>
              </template>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                <div>转化率：</div>
                <div>
                  <count-to :start-val="1" suffix="%" :end-val="orderLarge.amount" />
                </div>
              </template>
            </div>
          </template>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="成交额" :segmented="{ content: 'hard', footer: 'hard' }" size="small" :bordered="false">
          <template #header-extra>
            <n-tag type="error">月</n-tag>
          </template>
          <div class="p-3 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <count-to v-else prefix="￥" :start-val="1" :end-val="volume.weekLarge" class="f-sz-30 lh-40" />
          </div>
          <div class="p-3 flex justify-between">
            <div>
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                月同比
                <count-to :start-val="1" suffix="%" :end-val="volume.rise" />
                <n-icon size="12" color="#00ff6f">
                  <CaretUpOutlined />
                </n-icon>
              </template>
            </div>
            <div>
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                月同比
                <count-to :start-val="1" suffix="%" :end-val="volume.decline" />
                <n-icon size="12" color="#ffde66">
                  <CaretDownOutlined />
                </n-icon>
              </template>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                <div>总成交额：</div>
                <div>
                  <count-to prefix="￥" :start-val="1" :end-val="volume.amount" />
                </div>
              </template>
            </div>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!--导航卡片-->
    <div class="mt-16">
      <n-grid cols="1 s:2 m:3 l:8 xl:8 2xl:8" responsive="screen" :x-gap="16" :y-gap="8">
        <n-grid-item v-for="(item, index) in iconList" :key="index">
          <n-card content-style="padding-top: 0;" size="small" :bordered="false">
            <template #footer>
              <n-skeleton v-if="loading" size="medium" />
              <div v-else class="cursor-pointer">
                <p class="flex justify-center">
                  <span>
                    <n-icon :size="item.size" class="flex-1" :color="item.color">
                      <component :is="item.icon" v-on="item.eventObject || {}" />
                    </n-icon>
                  </span>
                </p>
                <p class="flex justify-center">
                  <span>{{ item.title }}</span>
                </p>
              </div>
            </template>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!--访问量 | 流量趋势-->
    <VisiTab />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { homeApi } from '@/api';
  import VisiTab from './components/VisiTab.vue';
  import { CountTo } from '@/components/CountTo/index';
  import {
    CaretUpOutlined,
    CaretDownOutlined,
    UsergroupAddOutlined,
    BarChartOutlined,
    ShoppingCartOutlined,
    AccountBookOutlined,
    CreditCardOutlined,
    MailOutlined,
    TagsOutlined,
    SettingOutlined,
  } from '@/utils/icons';

  // const cardHeaderStyle = ref({ 'border-bottom': '1px solid #eee', 'font-size': '16px' });

  const loading = ref(true);
  const visits = ref({}) as any;
  const saleroom = ref({}) as any;
  const orderLarge = ref({}) as any;
  const volume = ref({}) as any;

  // 图标列表
  const iconList = [
    {
      icon: UsergroupAddOutlined,
      size: '32',
      title: '用户',
      color: '#69c0ff',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: BarChartOutlined,
      size: '32',
      title: '分析',
      color: '#69c0ff',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: ShoppingCartOutlined,
      size: '32',
      title: '商品',
      color: '#ff9c6e',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: AccountBookOutlined,
      size: '32',
      title: '订单',
      color: '#b37feb',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: CreditCardOutlined,
      size: '32',
      title: '票据',
      color: '#ffd666',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: MailOutlined,
      size: '32',
      title: '消息',
      color: '#5cdbd3',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: TagsOutlined,
      size: '32',
      title: '标签',
      color: '#ff85c0',
      eventObject: {
        click: () => {},
      },
    },
    {
      icon: SettingOutlined,
      size: '32',
      title: '配置',
      color: '#ffc069',
      eventObject: {
        click: () => {},
      },
    },
  ];

  onMounted(async () => {
    const consoleInfo = await homeApi.getConsoleInfo();
    visits.value = consoleInfo.visits;
    saleroom.value = consoleInfo.saleroom;
    orderLarge.value = consoleInfo.orderLarge;
    volume.value = consoleInfo.volume;
    loading.value = false;
  });
</script>

<style lang="scss" scoped></style>
