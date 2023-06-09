/*
 * @LastEditTime: 2023-06-09 17:15:08
 * @Description: 动态粒子背景
 * Math.random() 大于0 小于1的随机数
 */

const lineColor = 'rgba(187, 227, 255, 0.8)';
const currentCircleColor = 'rgba(187, 227, 255, 0.8)';
// 粒子圆数量
const circleNum = 100;
// 粒子圆的半径大小最大值
const circleRatioR = 4;

class Circle {
  //创建对象
  //以一个圆为对象
  //设置随机的 x，y坐标，r半径，_mx，_my移动的距离
  //this.r是创建圆的半径，参数越大半径越大
  //this._mx,this._my是移动的距离，参数越大移动
  x: number;
  y: number;
  r: number;
  _mx: number;
  _my: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * circleRatioR;
    this._mx = Math.random();
    this._my = Math.random();
  }

  //canvas 画圆和画直线
  //画圆就是正常的用canvas画一个圆
  //画直线是两个圆连线，为了避免直线过多，给圆圈距离设置了一个值，距离很远的圆圈，就不做连线处理
  drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    //arc() 方法使用一个中心点和半径，为一个画布的当前子路径添加一条弧。
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.closePath();
    ctx.fillStyle = lineColor;
    ctx.fill();
  }

  drawLine(ctx: CanvasRenderingContext2D, _circle: { x: number; y: number }) {
    const dx = this.x - _circle.x;
    const dy = this.y - _circle.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 150) {
      ctx.beginPath();
      //开始一条路径，移动到位置 this.x,this.y。创建到达位置 _circle.x,_circle.y 的一条线：
      ctx.moveTo(this.x, this.y); //起始点
      ctx.lineTo(_circle.x, _circle.y); //终点
      ctx.closePath();
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    }
  }

  // 圆圈移动
  // 圆圈移动的距离必须在屏幕范围内
  move(w: number, h: number) {
    this._mx = this.x < w && this.x > 0 ? this._mx : -this._mx;
    this._my = this.y < h && this.y > 0 ? this._my : -this._my;
    this.x += this._mx / 2;
    this.y += this._my / 2;
  }
}
//鼠标点画圆闪烁变动
class CurrentCirCle extends Circle {
  constructor(x: number, y: number) {
    super(x, y);
  }

  drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    //注释内容为鼠标焦点的地方圆圈半径变化
    //this.r = (this.r < 14 && this.r > 1) ? this.r + (Math.random() * 2 - 1) : 2;
    this.r = 2;
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.closePath();
    //ctx.fillStyle = 'rgba(0,0,0,' + (parseInt(Math.random() * 100) / 100) + ')'
    ctx.fillStyle = currentCircleColor;
    ctx.fill();
  }
}

// 粒子背景
const particleBack = (window: browserWindow & typeof globalThis, document: Document) => {
  //更新页面用requestAnimationFrame替代setTimeout
  window.requestAnimationFrame = (() => {
    const customRequestAnimationFrame = (callback: () => void) => {
      setTimeout(callback, 1000 / 60);
    };
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      customRequestAnimationFrame
    );
  })();
  const circles: string | any[] = [];
  const current_circle = new CurrentCirCle(0, 0);

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < circles.length; i++) {
      circles[i].move(w, h);
      circles[i].drawCircle(ctx);
      for (let j = i + 1; j < circles.length; j++) {
        circles[i].drawLine(ctx, circles[j]);
      }
    }
    if (current_circle.x) {
      current_circle.drawCircle(ctx);
      for (let k = 1; k < circles.length; k++) {
        current_circle.drawLine(ctx, circles[k]);
      }
    }
    requestAnimationFrame(() => draw(ctx, w, h));
  };

  const loadCircles = (num: number, ctx: CanvasRenderingContext2D | null, w: number, h: number): any => {
    for (let i = 0; i < num; i++) {
      circles.push(new Circle(Math.random() * w, Math.random() * h));
    }
    if (ctx) {
      draw(ctx, w, h);
    }
  };

  // 创建canvas
  const createParticle = () => {
    const { body } = document;
    const canvas = document.createElement('canvas');
    // canvas.id = 'particleId';
    // 创建样式
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.5';
    // 设置canvas
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = body.offsetWidth);
    const h = (canvas.height = body.offsetHeight);
    document.body.appendChild(canvas);

    // 处理点击事件
    window.addEventListener('load', loadCircles(circleNum, ctx, w, h));
    window.onmousemove = (e) => {
      e = e || window.event;
      current_circle.x = e.clientX;
      current_circle.y = e.clientY;
    };
    window.onmouseout = () => {
      current_circle.x = 0;
      current_circle.y = 0;
    };
  };
  const init = () => {
    createParticle();
  };
  init();
};

// 设置
export const setupParticleBack = () => {
  particleBack(window, document);
};
