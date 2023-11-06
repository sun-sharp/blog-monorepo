import { billTypeEnum, billMethodEnum } from '../enums/money.enum';

// 微信账单数据整体处理
export const weChatExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  const tradeType = oldTarget.tradeType;
  const currentStatus = oldTarget.currentStatus;
  const paymentMethod = oldTarget.paymentMethod;
  const tradeOtherPerson = oldTarget.tradeOtherPerson;
  const goods = oldTarget.goods;
  if (['微信红包', '企业微信红包'].includes(tradeType) || tradeOtherPerson.indexOf('红包') !== -1) {
    target.billType = billTypeEnum.redPacket;
  } else if (['美团平台商户'].includes(tradeOtherPerson) || tradeOtherPerson.indexOf('美团') !== -1) {
    target.billType = billTypeEnum.mtOrder;
  } else if (['手机充值'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.phoneBill;
  } else if (['超市', '便利店', '成都红旗连锁股份有限公司', '华润万家', '中港CC店'].find((f) => tradeOtherPerson.indexOf(f) !== -1)) {
    target.billType = billTypeEnum.consumptionSupermarket;
  } else if (tradeType === '零钱充值') {
    target.billType = billTypeEnum.weChatChangeRecharge;
  } else if (['广州骑安'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficBicycle;
  } else if (
    [
      '兄弟江油肥肠',
      '大米先生',
      '黄焖鸡米饭',
      '71号豆汤饭',
      '面',
      '通宇物业',
      '星巴克',
      '肯德基',
      '蒸福包点',
      '米线',
      '巴食小厨',
      '包子',
      '佳馨包点',
      '早餐店',
      '土豆',
      '麦当劳',
    ].find((f) => tradeOtherPerson.indexOf(f) !== -1)
  ) {
    target.billType = billTypeEnum.eatingRestaurant;
  } else if (tradeOtherPerson === '高德' && goods === '高德打车') {
    target.billType = billTypeEnum.trafficTaxi;
  } else if (['中铁网络'].find((f) => tradeOtherPerson.indexOf(f) !== -1)) {
    target.billType = billTypeEnum.trafficTrain;
  }
  if (currentStatus === '已存入零钱' || paymentMethod === '零钱' || tradeType === '零钱充值') {
    target.billMethod = billMethodEnum.weChatChange;
  }
  if (tradeType === '零钱充值') {
    target['incomeOrPay'] = '收入';
  }
};

// 支付宝账单数据整体处理
export const aliPayExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  const tradeType = oldTarget.tradeType;
  const paymentMethod = oldTarget.paymentMethod;
  const transactionClassification = oldTarget.transactionClassification;
  const tradeOtherPerson = oldTarget.tradeOtherPerson;
  const productDescription = oldTarget.productDescription;
  const tradeStatus = oldTarget.tradeStatus;
  if (tradeStatus === '交易关闭') {
    target.billMethod = billMethodEnum.aliPayTradeClosure;
  } else if (paymentMethod === '余额') {
    target.billMethod = billMethodEnum.aliPayBalance;
  } else if (['余额宝'].includes(paymentMethod) || ['余额宝-笔笔攒-单笔攒入', '余额宝-单次转入'].includes(productDescription)) {
    target.billMethod = billMethodEnum.aliPayBalanceBaby;
  } else if (['花呗', '花呗&红包'].includes(paymentMethod)) {
    target.billMethod = billMethodEnum.aliPayHuaBei;
  } else if (['单车骑行卡抵扣'].includes(paymentMethod)) {
    target.billMethod = billMethodEnum.other;
  } else if (['中国工商银行储蓄卡(3413)'].includes(paymentMethod)) {
    target.billMethod = billMethodEnum.business;
  }

  if (tradeStatus === '交易关闭') {
    target.billType = billTypeEnum.invalid;
  } else if (
    transactionClassification === '交通出行' &&
    tradeOtherPerson === '成都金控数据服务有限公司' &&
    ['天府通扫码乘车', '天府通APP乘车'].includes(productDescription)
  ) {
    target.billType = billTypeEnum.trafficSubway;
  } else if (['余额宝-笔笔攒-单笔攒入', '余额宝-单次转入'].includes(productDescription)) {
    target.billType = billTypeEnum.aliPayBalanceBabyRecharge;
  } else if (tradeType === '餐饮美食') {
    target.billType = billTypeEnum.eatingRestaurant;
  } else if (paymentMethod === '余额' && ['充值-普通充值', '余额宝-转出到余额'].includes(productDescription)) {
    target.billType = billTypeEnum.aliPayBalanceRecharge;
  } else if (tradeType === '投资理财') {
    target.billType = billTypeEnum.manageMoneyMatters;
  } else if (productDescription.indexOf('手机充值') !== -1) {
    target.billType = billTypeEnum.phoneBill;
  } else if (['哈啰出行', '广州骑安科技有限公司'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficBicycle;
  } else if (['滴滴出行', '高德打车'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficTaxi;
  } else if (['成都金控数据服务有限公司', '地铁', '一应黔行'].find((f) => tradeOtherPerson.indexOf(f) !== -1)) {
    target.billType = billTypeEnum.trafficSubway;
  } else if (['便利店', '超市', '红旗连锁'].find((f) => tradeOtherPerson.indexOf(f) !== -1)) {
    target.billType = billTypeEnum.consumptionSupermarket;
  } else if (['成都空港公共交通有限公司'].includes(tradeOtherPerson)) {
    target.billType = billTypeEnum.trafficTransit;
  } else if (productDescription === '借呗还款') {
    target.billType = billTypeEnum.returnBorrow;
  } else if (productDescription.indexOf('主动还款-花呗') !== -1) {
    target.billType = billTypeEnum.returnHuaBei;
  } else if (['中国铁路'].find((f) => tradeOtherPerson.indexOf(f) !== -1)) {
    target.billType = billTypeEnum.trafficTrain;
  }
  if (['充值-普通充值', '余额宝-单次转入'].includes(productDescription) || ['花呗'].includes(tradeOtherPerson)) {
    target['incomeOrPay'] = '收入';
  } else if (
    ['借呗还款', '提现-快速提现'].includes(productDescription) ||
    ['借呗'].includes(tradeOtherPerson) ||
    productDescription.indexOf('主动还款-花呗') !== -1 ||
    productDescription.indexOf('手机充值') !== -1
  ) {
    target['incomeOrPay'] = '支出';
  }
};

// 银行账单数据整体处理
export const bankExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  const explain = oldTarget['explain'] || '';
  const tradeOtherPerson = oldTarget['tradeOtherPerson'] || ''; // 交易对方
  const tradeType = oldTarget['tradeType'] || '';
  const tradeOtherPersonAccount = oldTarget['tradeOtherPersonAccount']; // 凭证号码
  if (
    ['支付宝（中国）网络技术有限公司', '⽀付宝（中国）⽹络技术有限公司', '⽀付宝', '215500690', '蚂蚁基金'].find((f) => tradeOtherPerson.indexOf(f) !== -1) ||
    ['215500690'].includes(tradeOtherPersonAccount) ||
    ['⽀付宝'].find((f) => explain.indexOf(f) !== -1)
  ) {
    target['bankBillType'] = billTypeEnum.bankAliPayUse;
  } else if (
    ['财付通'].find((f) => explain.indexOf(f) !== -1) ||
    ['243300133', '财付通支付科技有限公司', '微信转账', '微信零钱充值账户'].find((f) => tradeOtherPerson.indexOf(f) !== -1) ||
    ['243300133'].includes(tradeOtherPersonAccount) ||
    ['微信零钱提现'].find((f) => tradeType.indexOf(f) !== -1)
  ) {
    target['bankBillType'] = billTypeEnum.bankWeChatUse;
  } else if (['工资', '劳务'].find((f) => explain.indexOf(f) !== -1)) {
    target['bankBillType'] = billTypeEnum.basicCapital;
  } else if (['地铁'].find((f) => tradeOtherPerson.indexOf(f) !== -1)) {
    target['bankBillType'] = billTypeEnum.trafficSubway;
  } else if (['利息'].find((f) => explain.indexOf(f) !== -1)) {
    target['bankBillType'] = billTypeEnum.interest;
  } else if (['报销'].find((f) => explain.indexOf(f) !== -1)) {
    target['bankBillType'] = billTypeEnum.companyReimbursement;
  } else if (['存款'].find((f) => explain.indexOf(f) !== -1)) {
    target['bankBillType'] = billTypeEnum.cashTransit;
  }
};
