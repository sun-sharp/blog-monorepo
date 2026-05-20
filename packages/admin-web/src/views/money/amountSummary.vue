<script lang="ts" setup>
  import { moneyApi } from '@/api';
  import { onMounted, ref } from 'vue';
  import InnerPieChart from '@/components/charts/InnerPieChart.vue';
  import SingleColumnChart from '@/components/charts/SingleColumnChart.vue';
  import { lastMonthFormatRange } from '@/utils';
  import { ApiBankFlowResult, ApiMoneyBalanceResult } from '/#/api/blog/money';
  import { ApiStartEndTimeParams } from '/#/api/common';
  import MoneyTimeTypeSelect from './components/MoneyTimeTypeSelect.vue';

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
          const text = datum ? `¥ ${datum.value.toFixed(2)}` : `¥ ${data.reduce((r: any, d: { value: any }) => r + d.value, 0).toFixed(2)}`;
          return text;
        },
      },
    },
  };
  const moneyBalanceData = ref<ApiMoneyBalanceResult[]>([]);
  const getMoneyBalance = () => {
    moneyApi
      .statisticsMoneyBalance()
      .then((data) => {
        moneyBalanceData.value = data;
      })
      .finally(() => {});
  };

  // 获取银行数据的流动汇总
  const bankFlowDateRange = ref(lastMonthFormatRange('yyyy-MM-dd'));
  const bankFlowData = ref<ApiBankFlowResult[]>([]);
  const getBankFlow = (formattedValue: [string, string]) => {
    bankFlowDateRange.value = formattedValue;
    const params: ApiStartEndTimeParams = {
      startTime: '',
      endTime: '',
    };
    if (bankFlowDateRange.value && bankFlowDateRange.value.length > 0) {
      params.startTime = bankFlowDateRange.value[0] + ' 00:00:00';
      params.endTime = bankFlowDateRange.value[1] + ' 23:59:59';
    }
    moneyApi
      .getStatisticsBankFlow(params)
      .then((data) => {
        bankFlowData.value = data.filter((f) => f.voucherNum !== 0);
      })
      .finally(() => {});
  };
  // 点击改变时间
  const bankFlowTimeSelectChange = (formattedValue: [string, string]) => {
    getBankFlow(formattedValue);
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
    const params: ApiStartEndTimeParams = {
      startTime: '',
      endTime: '',
    };
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
  // 点击改变时间
  const inflowOrOutflowTimeSelectChange = (formattedValue: [string, string]) => {
    getInflowOrOutflowMoney(formattedValue);
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
      <div class="summary-card" style="height: 440px">
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
          <money-time-type-select direction="vertical" @time-select-change="bankFlowTimeSelectChange" @date-picker-change="getBankFlow($event)" />
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
      <div class="summary-card full-card mt-20" style="height: 800px">
        <div class="summary-card__head">
          <span>各方式所流入/流出的金额</span>
          <money-time-type-select @time-select-change="inflowOrOutflowTimeSelectChange" @date-picker-change="getInflowOrOutflowMoney($event)" />
        </div>
        <div class="summary-card__chart">
          <div class="chart-separate">
            <div class="chart-separate__head">
              <span>流入总金额：{{ inflowMoneySumTotal || 0 }} 元</span>
            </div>
            <div class="chart-separate__cont">
              <single-column-chart
                v-if="inflowMoneyData.length > 0"
                :chart-data="inflowMoneyData"
                :custom-cfg="inflowMoneyCustomCfg"
                x-field="name"
                y-field="money"></single-column-chart>
              <n-empty v-else class="w-full h-full justify-center" description="无流入数据"></n-empty>
            </div>
          </div>
          <div class="chart-separate mt-10">
            <div class="chart-separate__head">
              <span>流出总金额：{{ outflowMoneySumTotal || 0 }} 元</span>
            </div>
            <div class="chart-separate__cont">
              <single-column-chart
                v-if="outflowMoneyData.length > 0"
                :chart-data="outflowMoneyData"
                :custom-cfg="outflowMoneyCustomCfg"
                x-field="name"
                y-field="money"></single-column-chart>
              <n-empty v-else class="w-full h-full justify-center" description="无流出数据"></n-empty>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<style lang="scss" scoped>
  .amount-summary {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .summary-card {
      display: flex;
      flex-direction: column;
      width: calc(50% - 10px);
      background: #fff;
      box-shadow: 2px 0 9px 2px #f0f0f0;

      &.full-card {
        width: 100%;
      }

      &__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        color: #000;
        font-weight: 600;
        font-size: 18px;
        border-bottom: 1px solid #e9e9e9;

        .sub-title {
          margin-left: 10px;
          font-weight: 400;
          font-size: 14px;
        }

        .time-select {
          display: flex;
          align-items: center;

          &--item {
            font-weight: normal;
            font-size: 13px;
            cursor: pointer;

            &:not(:first-child) {
              margin-left: 8px;
            }

            &.active {
              color: $theme-color;
            }
          }
        }
      }

      &__chart {
        flex: 1;
        height: 0;
        padding: 10px;
        overflow: hidden;

        .chart-separate {
          display: flex;
          flex-direction: column;
          height: calc(50% - 5px);

          &__head {
            padding: 20px 0;
            font-weight: 400;
            font-size: 14px;
          }

          &__cont {
            flex: 1;
            height: 0;
          }
        }
      }

      &__list {
        flex: 1;
        width: 100%;
        height: 0;
        padding: 10px;

        .list-ul {
          display: flex;
          flex-wrap: wrap;
        }

        .list-item {
          min-width: 120px;
          margin-top: 5px;
          margin-right: 10px;
          padding: 5px;
          border: 1px solid #e4e4e4;

          h4 {
            color: #000;
          }

          p {
            color: #878787;
          }
        }
      }
    }
  }
</style>
