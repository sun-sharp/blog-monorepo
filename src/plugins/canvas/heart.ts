/*
 * @LastEditTime: 2023-06-12 20:47:51
 * @Description: 鼠标点击心形动画
 */

// 启动
const heartAnimation = (window: browserWindow & typeof globalThis, document: Document) => {
  const hearts: any[] = [];
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
  const gameLoop = () => {
    for (let i = 0; i < hearts.length; i++) {
      if (hearts[i].alpha <= 0) {
        document.body.removeChild(hearts[i].el);
        hearts.splice(i, 1);
        continue;
      }
      hearts[i].y--;
      hearts[i].scale += 0.004;
      hearts[i].alpha -= 0.013;
      hearts[i].el.style.cssText =
        'left:' +
        hearts[i].x +
        'px;top:' +
        hearts[i].y +
        'px;opacity:' +
        hearts[i].alpha +
        ';transform:scale(' +
        hearts[i].scale +
        ',' +
        hearts[i].scale +
        ') rotate(45deg);background:' +
        hearts[i].color;
    }
    requestAnimationFrame(gameLoop);
  };
  const css = (css: string) => {
    const style = document.createElement('style');
    try {
      style.appendChild(document.createTextNode(css));
    } catch (ex) {
      /* empty */
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  };

  const randomColor = () => {
    return 'rgb(' + ~~(Math.random() * 255) + ',' + ~~(Math.random() * 255) + ',' + ~~(Math.random() * 255) + ')';
  };

  const createHeart = (event: MouseEvent) => {
    const d = document.createElement('div');
    d.className = 'heart';
    hearts.push({
      el: d,
      x: event.clientX - 5,
      y: event.clientY - 5,
      scale: 1,
      alpha: 1,
      color: randomColor(),
    });
    document.body.appendChild(d);
  };
  const attachEvent = () => {
    const old = typeof window.onclick === 'function' && window.onclick;
    window.onclick = (event) => {
      old && old.call(window, event);
      createHeart(event);
    };
  };
  const init = () => {
    css(
      ".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: absolute;}.heart:after{top: -5px;}.heart:before{left: -5px;}"
    );
    attachEvent();
    gameLoop();
  };
  init();
};

// 设置
export const setupHeartAnimation = () => {
  heartAnimation(window, document);
};
