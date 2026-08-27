/**
 * 自定义日期格式化（支持星期几、AM/PM、12小时制）
 * @param {Date|number|string} date - 日期对象、时间戳（毫秒）或日期字符串
 * @param {string} fmt - 格式字符串，如 'yyyy-MM-dd EEEE a hh:mm:ss'
 * @returns {string} 格式化后的日期
 */
export declare const format: (date: any, fmt: string) => string;
/**
 * @description 近一个月的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export declare const nearlyMonthFormatRange: (formatStr: string) => [string, string];
/**
 * @description 近半年的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export declare const lastHalfYearFormatRange: (formatStr: string) => [string, string];
/**
 * @description 上个月的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export declare const lastMonthFormatRange: (formatStr: string) => [string, string];
/**
 * @description 上半年的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export declare const lastYearFormatRange: (formatStr: string) => [string, string];
/**
 * @description 今年1月1日至现在的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export declare const thisYearFormatRange: (formatStr: string) => [string, string];
/**
 * @description 今年1月1日至6月底的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export declare const firstHalfYearFormatRange: (formatStr: string) => [string, string];
/**
 * @description 今年5月初至现在的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export declare const secondHalfYearFormatRange: (formatStr: string) => [string, string];
/**
 * @description 近一年的时间范围
 * @param {string} formatStr
 * @return {*}  {[string, string]}
 */
export declare const nearlyYearFormatRange: (formatStr: string) => [string, string];
/**
 * @description 某年的全部天数
 * @param {number} year
 * @return {number}
 */
export declare const certainYearAllDays: (year: number) => number;
/**
 * @description 5月1日至现在的全部天数
 * @param {Date} defaultDate
 * @return {number}
 */
export declare const certainDateSpendDays: (defaultDate: Date) => number;
/**
 * @description 判断过去时间离现在多久并格式化时间
 * @param {string} time
 * @param {string} formatStr
 * @return {string}
 */
export declare const judgeRangeToFormatTime: (time: string, formatStr?: string) => string;
/**
 * @description 判断未来时间离现在多久并格式化时间
 * @param {string} time
 * @param {string} formatStr
 * @return {string}
 */
export declare const judgeRangeToFormatFutureTime: (time: string, formatStr?: string) => string;
//# sourceMappingURL=time.d.ts.map