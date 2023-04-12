import { aliPayEnum, capitalEnum, invalidEnum, weCharEnum } from '../enums/money.enum';

// 微信账单数据整体处理
export const weCharExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  target.tradeOtherPerson = oldTarget.tradeOtherPerson;
};

// 支付宝账单数据整体处理
export const aliPayExcelTargetHandler = (target: any) => {
  const oldTarget = JSON.parse(JSON.stringify(target));
  target.tradeOtherPerson = oldTarget.tradeOtherPerson;
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
    target['bankBillType'] = aliPayEnum.bankBillType;
  } else if (
    ['财付通'].includes(explain) ||
    ['243300133', '财付通支付科技有限公司', '微信转账', '微信零钱充值账户'].includes(tradeOtherPerson) ||
    ['243300133'].includes(tradeOtherPersonAccount) ||
    ['微信零钱提现'].includes(tradeType) ||
    ['财付通'].includes(tradeOtherPersonRemarks)
  ) {
    target['bankBillType'] = weCharEnum.bankBillType;
  } else if (['⼯资', '劳务'].includes(explain)) {
    target['bankBillType'] = capitalEnum.bankBillType;
  } else if (!oldTarget['bankBillType']) {
    target['bankBillType'] = invalidEnum.bankBillType;
  }
};
