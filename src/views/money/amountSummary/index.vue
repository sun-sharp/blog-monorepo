<script lang="ts" setup>
  import { moneyApi } from '@/api';
  import { onMounted, ref } from 'vue';
  import { format } from 'date-fns';
  import InnerPieChart from '@/components/charts/inner-pie-chart.vue';
  import SingleColumnChart from '@/components/charts/single-column-chart.vue';

  // 统计各个的方式的余额
  const defaultMoneyBalanceMap = {
    weChatBalance: '微信零钱',
    aliPayBalance: '支付宝余额',
    aliPayBalanceBaby: '支付宝余额宝',
    businessBank: '工商银行',
    agricultureBank: '农业银行',
    buildBank: '建设银行',
    civilBank: '民生银行',
    attractInvestmentBank: '招商银行',
  };
  const moneyBalanceCustomCfg = {
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
        style: {
          fontSize: '14px',
        },
        customHtml: (_container: any, _view: any, datum: { type: any }) => {
          const text = datum ? datum.type : '总计';
          return text;
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '20px',
        },
        customHtml: (_container: any, _view: any, datum: { value: any }, data: any[]) => {
          const text = datum ? `¥ ${datum.value}` : `¥ ${data.reduce((r: any, d: { value: any }) => r + d.value, 0)}`;
          return text;
        },
      },
    },
  };
  const moneyBalanceData = ref<any>([]);
  const getMoneyBalance = () => {
    moneyApi
      .statisticsMoneyBalance()
      .then((info) => {
        moneyBalanceData.value = Object.keys(info).map((key) => ({
          name: defaultMoneyBalanceMap[key],
          value: info[key],
        }));
      })
      .finally(() => {});
  };

  // 获取银行数据的流动汇总
  const lastMonthFormatRange = (formatStr: string): [string, string] => {
    const nowTime = new Date();
    const year = nowTime.getFullYear();
    const month = nowTime.getMonth();
    const day = new Date(year, month, 0).getDate();
    return [format(nowTime.getTime() - day * 24 * 60 * 60 * 1000, formatStr), format(nowTime, formatStr)];
  };
  const bankFlowDateRange = ref(lastMonthFormatRange('yyyy-MM-dd'));
  const defaultBankFlowMap = {
    business: '工商银行',
    agriculture: '农业银行',
    build: '建设银行',
    civil: '民生银行',
    attractInvestment: '招商银行',
  };
  const bankFlowData = ref<any[]>([]);
  const getBankFlow = (formattedValue: [string, string]) => {
    bankFlowDateRange.value = formattedValue;
    const params: any = {};
    if (bankFlowDateRange.value && bankFlowDateRange.value.length > 0) {
      params.startTime = bankFlowDateRange.value[0] + ' 00:00:00';
      params.endTime = bankFlowDateRange.value[1] + ' 23:59:59';
    }
    moneyApi
      .getStatisticsBankFlow(params)
      .then((info) => {
        bankFlowData.value = Object.keys(defaultBankFlowMap)
          .map((key) => ({
            ...(info[key] || {}),
            name: defaultBankFlowMap[key],
          }))
          .filter((f) => f.voucherNum !== 0);
      })
      .finally(() => {});
  };

  // 统计某时间范围内的方式流入/流出的金额
  const inflowOrOutflowMoneyDateRange = ref(lastMonthFormatRange('yyyy-MM-dd'));
  const outflowMoneyData = ref<any>([]);
  const outflowMoneyCustomCfg = {
    meta: {
      money: {
        alias: '金额',
      },
    },
  };
  const outflowMoneySumTotal = ref(0);
  const inflowMoneyData = ref<any>([]);
  const inflowMoneyCustomCfg = {
    meta: {
      money: {
        alias: '金额',
      },
    },
  };
  const inflowMoneySumTotal = ref(0);
  const getInflowOrOutflowMoney = (formattedValue: [string, string]) => {
    inflowOrOutflowMoneyDateRange.value = formattedValue;
    const params: any = {};
    if (inflowOrOutflowMoneyDateRange.value && inflowOrOutflowMoneyDateRange.value.length > 0) {
      params.startTime = inflowOrOutflowMoneyDateRange.value[0] + ' 00:00:00';
      params.endTime = inflowOrOutflowMoneyDateRange.value[1] + ' 23:59:59';
    }
    moneyApi
      .statisticsInflowOrOutflowMoney(params)
      .then((info) => {
        outflowMoneyData.value = info.outflowChart;
        outflowMoneySumTotal.value = info.outflowSumTotal;
        inflowMoneyData.value = info.inflowChart;
        inflowMoneySumTotal.value = info.inflowSumTotal;
      })
      .finally(() => {});
  };

  const init = () => {
    getMoneyBalance();
    getBankFlow(lastMonthFormatRange('yyyy-MM-dd'));
    getInflowOrOutflowMoney(lastMonthFormatRange('yyyy-MM-dd'));
  };

  onMounted(init);
</script>

<template>
  <n-card :bordered="false">
    <div class="amount-summary">
      <div class="summary-card">
        <div class="summary-card__head">
          <span>各个方式的余额</span>
        </div>
        <div class="summary-card__chart">
          <inner-pie-chart v-if="moneyBalanceData.length > 0" :chart-data="moneyBalanceData" :custom-cfg="moneyBalanceCustomCfg" />
          <n-empty v-else class="w-full h-full justify-center" description="无数据"></n-empty>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-card__head">
          <span>银行流动</span>
          <n-date-picker
            :formatted-value="bankFlowDateRange"
            style="width: 280px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            clearable
            @update:formatted-value="getBankFlow($event)"
          />
        </div>
        <div class="summary-card__list">
          <ul v-if="bankFlowData.length > 0" class="list-ul">
            <li v-for="(item, index) in bankFlowData" :key="index" class="list-item">
              <h4>名&emsp;&emsp;称：{{ item.name }}</h4>
              <p>开始余额：{{ item.startBalance }}</p>
              <p>结束余额：{{ item.endBalance }}</p>
              <p>流入金额：{{ item.inflowMoneyAmount }}</p>
              <p>流出金额：{{ item.outflowMoneyAmount }}</p>
              <p>凭&emsp;&emsp;证：{{ item.voucherNum }}份</p>
            </li>
          </ul>
          <n-empty v-else class="w-full h-full justify-center" description="无数据"></n-empty>
        </div>
      </div>
      <div class="summary-card full-card" style="height: 800px">
        <div class="summary-card__head">
          <span>
            各方式所流入/流出的金额
            <span class="sub-title">流出总金额：{{ outflowMoneySumTotal || 0 }}</span>
            <span class="sub-title">流入总金额：{{ inflowMoneySumTotal || 0 }}</span>
          </span>
          <n-date-picker
            :formatted-value="inflowOrOutflowMoneyDateRange"
            style="width: 280px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            clearable
            @update:formatted-value="getInflowOrOutflowMoney($event)"
          />
        </div>
        <div class="summary-card__chart">
          <div class="chart-separate">
            <single-column-chart
              v-if="outflowMoneyData.length > 0"
              :chart-data="outflowMoneyData"
              :custom-cfg="outflowMoneyCustomCfg"
              x-field="name"
              y-field="money"
            ></single-column-chart>
            <n-empty v-else class="w-full h-full justify-center" description="无流出数据"></n-empty>
          </div>
          <div class="chart-separate mt-10">
            <single-column-chart
              v-if="inflowMoneyData.length > 0"
              :chart-data="inflowMoneyData"
              :custom-cfg="inflowMoneyCustomCfg"
              x-field="name"
              y-field="money"
            ></single-column-chart>
            <n-empty v-else class="w-full h-full justify-center" description="无流入数据"></n-empty>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<style lang="scss" scoped>
  .amount-summary {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .summary-card {
      width: calc(50% - 10px);
      height: 400px;
      background: #ffffff;
      box-shadow: 2px 0px 9px 2px #f0f0f0;
      display: flex;
      flex-direction: column;

      &.full-card {
        width: 100%;
      }

      &__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        color: #000;
        font-weight: 600;
        padding: 10px 16px;
        border-bottom: 1px solid #e9e9e9;

        .sub-title {
          font-size: 14px;
          font-weight: 400;
          margin-left: 10px;
        }
      }

      &__chart {
        padding: 10px;
        flex: 1;
        height: 0;
        overflow: hidden;

        .chart-separate {
          height: calc(50% - 5px);
        }
      }

      &__list {
        width: 100%;
        flex: 1;
        height: 0;
        padding: 10px;

        .list-ul {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .list-item {
          width: calc(100% / 3 - 5px);
          padding: 5px;
          border: 1px solid #e4e4e4;
          margin-top: 5px;

          h4 {
            color: #000;
          }
          p {
            color: #878787;
          }
        }
      }

      &:nth-child(n + 3) {
        margin-top: 20px;
      }
    }
  }
</style>
