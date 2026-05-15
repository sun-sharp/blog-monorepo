import { ExtractPropTypes, Ref, ref } from 'vue';
import { DragProps } from './useDragResize';
import { IDragData, IDragStringNum, IDragStringStr } from '/#/components/drag';

/**
 * 统一处理拖拽事件
 * @param onMousemove 鼠标移动处理函数
 */
export function setupMove(onMousemove: (e: MouseEvent) => void, onMouseupCb?: (e: MouseEvent) => void) {
  const onMouseup = (_e: MouseEvent) => {
    onMouseupCb && onMouseupCb(_e);
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);
  };
  document.addEventListener('mousemove', onMousemove);
  document.addEventListener('mouseup', onMouseup);
}

export const useDragDot = (dragData: Ref<IDragData>, props: ExtractPropTypes<typeof DragProps>, resizeEmitFun: Function) => {
  const cursorDirectionArray = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
  const resizableMap: IDragStringStr = {
    n: 'top',
    s: 'bottom',
    e: 'right',
    w: 'left',
    ne: 'top-right',
    nw: 'top-left',
    se: 'bottom-right',
    sw: 'bottom-left',
  };
  const cursorStartMap: IDragStringNum = { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7 };
  const cursorMap: IDragStringNum = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7, 11: 8 };

  // 出来鼠标样式
  const getCursor = (rotateAngle: number, d: string) => {
    const increment = cursorMap[Math.floor(rotateAngle / 30)];
    const index = cursorStartMap[d];
    const newIndex = (index + increment) % 8;
    return cursorDirectionArray[newIndex];
  };

  const getDotList = (angle = 0) => {
    const dots = [];
    for (let index = 0; index < cursorDirectionArray.length; index++) {
      const key = cursorDirectionArray[index];

      const [side, position] = resizableMap[key].split('-');

      const cursor = getCursor(angle, key);

      const style = { [side]: '0%', cursor: cursor + '-resize', side: resizableMap[key] };
      if (!position) {
        const side2 = ['top', 'bottom'].includes(side) ? 'left' : 'top';
        style[side2] = '50%';
      } else {
        style[position] = '0%';
      }

      dots[index] = style;
    }

    return dots;
  };

  // 点
  const dotList = ref(getDotList());

  const getLength = (x: number, y: number) => Math.sqrt(x * x + y * y);
  const degToRadian = (deg: number) => (deg * Math.PI) / 180;
  const setWidthAndDeltaW = (width: number, deltaW: number, minWidth: number) => {
    const expectedWidth = width + deltaW;
    if (expectedWidth > minWidth) {
      width = expectedWidth;
    } else {
      deltaW = minWidth - width;
      width = minWidth;
    }
    return { width, deltaW };
  };
  const setHeightAndDeltaH = (height: number, deltaH: number, minHeight: number) => {
    const expectedHeight = height + deltaH;
    if (expectedHeight > minHeight) {
      height = expectedHeight;
    } else {
      deltaH = minHeight - height;
      height = minHeight;
    }
    return { height, deltaH };
  };
  const cos = (deg: number) => Math.cos(degToRadian(deg));
  const sin = (deg: number) => Math.sin(degToRadian(deg));
  const getNewStyle = (
    type: string,
    rect: { rotateAngle: number; width: number; height: number; centerX: number; centerY: number },
    deltaW: number,
    deltaH: number,
    ratio: number | undefined,
    minWidth: number,
    minHeight: number
  ) => {
    let { width, height, centerX, centerY } = rect;
    const { rotateAngle } = rect;
    const widthFlag = width < 0 ? -1 : 1;
    const heightFlag = height < 0 ? -1 : 1;
    width = Math.abs(width);
    height = Math.abs(height);
    switch (type) {
      case 'right': {
        const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
        width = widthAndDeltaW.width;
        deltaW = widthAndDeltaW.deltaW;
        if (ratio) {
          deltaH = deltaW / ratio;
          height = width / ratio;
          // 左上角固定
          centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
          centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
        } else {
          // 左边固定
          centerX += (deltaW / 2) * cos(rotateAngle);
          centerY += (deltaW / 2) * sin(rotateAngle);
        }
        break;
      }
      case 'top-right': {
        deltaH = -deltaH;
        const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
        width = widthAndDeltaW.width;
        deltaW = widthAndDeltaW.deltaW;
        const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
        height = heightAndDeltaH.height;
        deltaH = heightAndDeltaH.deltaH;
        if (ratio) {
          deltaW = deltaH * ratio;
          width = height * ratio;
        }
        centerX += (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
        centerY += (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
        break;
      }
      case 'bottom-right': {
        const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
        width = widthAndDeltaW.width;
        deltaW = widthAndDeltaW.deltaW;
        const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
        height = heightAndDeltaH.height;
        deltaH = heightAndDeltaH.deltaH;
        if (ratio) {
          deltaW = deltaH * ratio;
          width = height * ratio;
        }
        centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
        centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
        break;
      }
      case 'bottom': {
        const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
        height = heightAndDeltaH.height;
        deltaH = heightAndDeltaH.deltaH;
        if (ratio) {
          deltaW = deltaH * ratio;
          width = height * ratio;
          // 左上角固定
          centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
          centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
        } else {
          // 上边固定
          centerX -= (deltaH / 2) * sin(rotateAngle);
          centerY += (deltaH / 2) * cos(rotateAngle);
        }
        break;
      }
      case 'bottom-left': {
        deltaW = -deltaW;
        const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
        width = widthAndDeltaW.width;
        deltaW = widthAndDeltaW.deltaW;
        const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
        height = heightAndDeltaH.height;
        deltaH = heightAndDeltaH.deltaH;
        if (ratio) {
          height = width / ratio;
          deltaH = deltaW / ratio;
        }
        centerX -= (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
        centerY -= (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
        break;
      }
      case 'left': {
        deltaW = -deltaW;
        const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
        width = widthAndDeltaW.width;
        deltaW = widthAndDeltaW.deltaW;
        if (ratio) {
          height = width / ratio;
          deltaH = deltaW / ratio;
          // 右上角固定
          centerX -= (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
          centerY -= (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
        } else {
          // 右边固定
          centerX -= (deltaW / 2) * cos(rotateAngle);
          centerY -= (deltaW / 2) * sin(rotateAngle);
        }
        break;
      }
      case 'top-left': {
        deltaW = -deltaW;
        deltaH = -deltaH;
        const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
        width = widthAndDeltaW.width;
        deltaW = widthAndDeltaW.deltaW;
        const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
        height = heightAndDeltaH.height;
        deltaH = heightAndDeltaH.deltaH;
        if (ratio) {
          width = height * ratio;
          deltaW = deltaH * ratio;
        }
        centerX -= (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
        centerY -= (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
        break;
      }
      case 'top': {
        deltaH = -deltaH;
        const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
        height = heightAndDeltaH.height;
        deltaH = heightAndDeltaH.deltaH;
        if (ratio) {
          width = height * ratio;
          deltaW = deltaH * ratio;
          // 左下角固定
          centerX += (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
          centerY += (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
        } else {
          centerX += (deltaH / 2) * sin(rotateAngle);
          centerY -= (deltaH / 2) * cos(rotateAngle);
        }
        break;
      }
    }

    return {
      position: {
        centerX,
        centerY,
      },
      size: {
        width: width * widthFlag,
        height: height * heightFlag,
      },
    };
  };
  const centerToTL = ({ centerX, centerY, width, height }: { centerX: number; centerY: number; width: number; height: number }) => ({
    top: centerY - height / 2,
    left: centerX - width / 2,
    width,
    height,
  });
  const formatData = (data: { width: number; height: number }, centerX: number, centerY: number) => {
    const { width, height } = data;
    return {
      width: Math.abs(width),
      height: Math.abs(height),
      left: centerX - Math.abs(width) / 2,
      top: centerY - Math.abs(height) / 2,
    };
  };

  // 缩放
  const onDotMousedown = (
    e: MouseEvent,
    dotInfo: {
      [x: string]: string;
      cursor: string;
      side: string;
    }
  ) => {
    e.stopPropagation();
    e.preventDefault();
    // 获取鼠标按下的坐标
    const downX = e.clientX;
    const downY = e.clientY;
    const { width, height, left, top } = dragData.value;

    // 中心点
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const rect = { width, height, centerX, centerY, rotateAngle: 0 };
    const type = dotInfo.side;
    resizeEmitFun('resizeStart', dragData.value);

    const onMousemove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      // 距离
      const deltaX = clientX - downX;
      const deltaY = clientY - downY;

      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);
      const isShiftKey = e.shiftKey;

      const beta = alpha - degToRadian(rect.rotateAngle);
      const deltaW = deltaL * Math.cos(beta);
      const deltaH = deltaL * Math.sin(beta);
      const ratio = isShiftKey ? rect.width / rect.height : undefined;

      const {
        position: { centerX, centerY },
        size: { width, height },
      } = getNewStyle(type, { ...rect, rotateAngle: rect.rotateAngle }, deltaW, deltaH, ratio, props.minWidth, props.minHeight);

      const pData = centerToTL({ centerX, centerY, width, height });
      dragData.value = { ...formatData(pData, centerX, centerY) };
      resizeEmitFun('resize', dragData.value);
    };

    setupMove(onMousemove, () => {
      resizeEmitFun('resizeEnd', dragData.value);
    });
  };

  return {
    dotList,
    onDotMousedown,
  };
};
