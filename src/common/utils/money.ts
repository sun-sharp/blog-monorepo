import { billTypeEnum, billMethodEnum } from '../enums/money.enum';

// 微信账单数据整体处理
export const weChatExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  const tradeType = oldTarget.tradeType;
  const currentStatus = oldTarget.currentStatus;
  const paymentMethod = oldTarget.paymentMethod;
  if (['微信红包'].includes(tradeType)) {
    target.billType = billTypeEnum.redPacket;
  }
  // 微信零钱
  if (currentStatus === '已存入零钱' || paymentMethod === '零钱' || tradeType === '零钱充值') {
    target.billMethod = billMethodEnum.weChatChange;
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
  if (tradeType !== '账户存取' && paymentMethod === '余额') {
    target.billMethod = billMethodEnum.aliPayBalance;
  } else if (['余额宝'].includes(paymentMethod)) {
    target.billMethod = billMethodEnum.aliPayBalanceBaby;
  } else if (['花呗'].includes(paymentMethod)) {
    target.billMethod = billMethodEnum.aliPayHuaBei;
  } else if (paymentMethod.includes('中国农业银行')) {
    target.billMethod = billMethodEnum.agriculture;
  } else if (paymentMethod.includes('中国工商银行')) {
    target.billMethod = billMethodEnum.business;
  }
  // 交通-地铁
  if (
    transactionClassification === '交通出行' &&
    tradeOtherPerson === '成都金控数据服务有限公司' &&
    ['天府通扫码乘车', '天府通APP乘车'].includes(productDescription)
  ) {
    target.billType = billTypeEnum.trafficSubway;
  } else if (['余额宝-笔笔攒-单笔攒入'].includes(productDescription)) {
    target.billType = billTypeEnum.aliPayBalanceBabyRecharge;
  }
};

// 银行账单数据整体处理
export const bankExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  const explain = oldTarget['explain'];
  const tradeOtherPerson = oldTarget['tradeOtherPerson'];
  const tradeType = oldTarget['tradeType'];
  const tradeOtherPersonAccount = oldTarget['tradeOtherPersonAccount'];
  const tradeOtherPersonRemarks = oldTarget['tradeOtherPersonRemarks'];
  if (
    ['支付宝（中国）网络技术有限公司', '⽀付宝（中国）⽹络技术有限公司', '⽀付宝', '215500690', '蚂蚁基金'].includes(tradeOtherPerson) ||
    ['215500690'].includes(tradeOtherPersonAccount) ||
    ['⽀付宝'].includes(explain) ||
    ['支付宝'].includes(tradeOtherPersonRemarks)
  ) {
    target['bankBillType'] = billTypeEnum.aliPayTransit;
  } else if (
    ['财付通'].includes(explain) ||
    ['243300133', '财付通支付科技有限公司', '微信转账', '微信零钱充值账户'].includes(tradeOtherPerson) ||
    ['243300133'].includes(tradeOtherPersonAccount) ||
    ['微信零钱提现'].includes(tradeType) ||
    ['财付通'].includes(tradeOtherPersonRemarks)
  ) {
    target['bankBillType'] = billTypeEnum.weChatTransit;
  } else if (['⼯资', '劳务'].includes(explain)) {
    target['bankBillType'] = billTypeEnum.basicCapital;
  } else if (!oldTarget['bankBillType']) {
    target['bankBillType'] = billTypeEnum.invalid;
  }
};
