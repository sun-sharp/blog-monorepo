/**
 * @description: 多条件相同元素合并成一个新数组
 * @param {any[]} jsonArr // 需要处理的数组
 * @param {string} keyInfo // 二级字段
 * @param {any[]} conditions // 多个条件
 * @return {*}
 */
export const groupArray = (jsonArr: any[], keyInfo: string, conditions: any[]): any => {
  const newJson = []; // 合并好的数据都放在这个数组里
  jsonArr.forEach((itemJson) => {
    let mark = -1;
    const findData = newJson.find((itemFind, indexFind) => {
      let ifCond = true;
      conditions.forEach((cond) => {
        ifCond = ifCond && itemFind[cond] === itemJson[cond];
      });
      if (ifCond) {
        mark = indexFind;
        return ifCond;
      }
    });
    if (!findData) {
      const value = {};
      conditions.forEach((cond) => {
        value[cond] = itemJson[cond];
      });
      value[keyInfo] = [];
      const info = {};
      for (const i in itemJson) {
        let ifCond = true;
        conditions.forEach((cond) => {
          ifCond = ifCond && i !== cond;
        });
        if (ifCond) {
          info[i] = itemJson[i];
        }
      }
      value[keyInfo].push(info);
      newJson.push(value);
    } else {
      const info = {};
      for (const i in itemJson) {
        let ifCond = true;
        conditions.forEach((cond) => {
          ifCond = ifCond && i !== cond;
        });
        if (ifCond) {
          info[i] = itemJson[i];
        }
      }
      newJson[mark][keyInfo].push(info);
    }
  });
  return newJson;
};

/**
 * @description: 利用ES6 Set去重
 * @param {string[]} arr
 * @return {string[]}
 */
export const uniqueArray = (arr: string[]): string[] => {
  return Array.from(new Set(arr));
};

/**
 * @description: 数组相加sum
 * @param {number[]} arr
 * @return {number}
 */
export const sumArray = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return arr.reduce((prev, curr) => {
    return prev + curr;
  });
};

/**
 * @description: 将数组相加后转化为金额
 * @param {any[]} arr
 * @param {string} key
 * @return {number}
 */
export const sumArrayToMoney = (arr: any[], key: string): number => {
  const moneyNum = Number(sumArray(arr.map((m) => m[key])).toFixed(2));
  return isNaN(moneyNum) ? 0 : moneyNum;
};
