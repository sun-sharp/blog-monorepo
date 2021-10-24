const proxy = require('http-proxy-middleware');

let target = '';
if ( process.env.BABEL_ENV === "development") {
  target = "http://localhost:3000";
} else {
  target = "https://www.yangruirui.top";
}
console.log(process.env.BABEL_ENV, "运行环境", target);
module.exports = function(app) {
  app.use(
    proxy('/blog', {
      target,
      changeOrigin: true,
      pathRewrite: {
        '^/blog': '/blog',
      },
    }),
  );
};
