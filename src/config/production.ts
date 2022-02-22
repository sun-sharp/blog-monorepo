export default {
  // 端口
  port: parseInt(process.env.PORT, 10) || 3000,
  // 是否开启swagger
  enableSwagger: true,
  // 文件
  file: {
    lib: '/www/wwwroot/nestApi',
  },
};
