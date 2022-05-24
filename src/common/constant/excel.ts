// 微信账单key值重命名
export const weCharExcelCellHandle = {
  1: (tar: any, val: any) => {
    tar['tradeTime'] = val;
  }, // 交易时间
  2: (tar: any, val: any) => {
    tar['tradeType'] = val;
  }, // 交易类型
  3: (tar: any, val: any) => {
    tar['tradeOtherPerson'] = val;
  }, // 交易对方
  4: (tar: any, val: any) => {
    tar['goods'] = val;
  }, // 商品
  5: (tar: any, val: any) => {
    tar['incomeOrPay'] = val;
  }, // 收入
  6: (tar: any, val: any) => {
    const money = val.replace('¥', '');
    tar['moneyAmount'] = money;
  }, // 金额(元)
  7: (tar: any, val: any) => {
    tar['paymentMethod'] = val;
  }, // 支付方式
  8: (tar: any, val: any) => {
    tar['currentStatus'] = val;
  }, // 当前状态
  // 9: (tar: any, val: any) => {
  //   tar['transactionNo'] = val;
  // }, // 交易单号
  // 10: (tar: any, val: any) => {
  //   tar['merchantNo'] = val;
  // }, // 商户单号
  11: (tar: any, val: any) => {
    tar['remarks'] = val;
  }, // 备注
};
