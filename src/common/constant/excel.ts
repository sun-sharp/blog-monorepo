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

// 支付宝账单key值重命名
export const aliPayExcelCellHandle = {
  1: (tar: any, val: any) => {
    tar['incomeOrPay'] = val;
  }, // 收/支
  2: (tar: any, val: any) => {
    tar['tradeOtherPerson'] = val;
  }, // 交易对方
  3: (tar: any, val: any) => {
    tar['oppositeAccount'] = val;
  }, // 对方账号
  4: (tar: any, val: any) => {
    tar['productDescription'] = val;
  }, // 商品说明
  5: (tar: any, val: any) => {
    tar['paymentMethod'] = val;
  }, // 收/付款方式
  6: (tar: any, val: any) => {
    const money = val;
    tar['moneyAmount'] = money;
  }, // 金额
  7: (tar: any, val: any) => {
    tar['transactionStatus'] = val;
  }, // 交易状态
  8: (tar: any, val: any) => {
    tar['transactionClassification'] = val;
  }, // 交易分类
  // 9: (tar: any, val: any) => {
  //   tar['transactionNo'] = val;
  // }, // 交易订单号
  // 10: (tar: any, val: any) => {
  //   tar['merchantNo'] = val;
  // }, // 商户订单号
  11: (tar: any, val: any) => {
    tar['tradeTime'] = val;
  }, // 交易时间
};
