/**
 * 用于开发和生产的模拟插件。
 * https://github.com/anncwb/vite-plugin-mock
 */
import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin(isBuild: boolean, prodMock: boolean) {
  return viteMockServe({
    // ↓忽略以_开头的文件
    ignore: /^\_/,
    // ↓解析根目录下的mock文件夹
    mockPath: 'mock', //mock文件地址
    localEnabled: !isBuild, // 开发打包开关
    prodEnabled: isBuild && prodMock, // 生产打包开关
    // 这样可以控制关闭mock的时候不让mock打包到最终代码内
    injectCode: `
       import { setupProdMockServer } from '../mock/_createProductionServer';
 
       setupProdMockServer();
       `,
    logger: false, //是否在控制台显示请求日志
    supportTs: false, //打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件
  });
}
