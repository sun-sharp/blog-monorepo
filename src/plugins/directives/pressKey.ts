import { useThrottleFn } from '@vueuse/core';
import type { ObjectDirective } from 'vue';

/**
 * @param {string} key 键值
 * @param {Function} funVal 执行的函数
 */
interface obj {
  arg: String;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  funVal: Function;
}

interface keys {
  [s: string]: obj;
}
const keys: keys = {};

// 等待时间
const wait = 100;

// 监听键盘使用
export const pressKey: ObjectDirective = {
  mounted(_el, bind) {
    if (!bind.arg) {
      console.error('请绑定需要触发的键，例如v-press-key:s，v-press-key:s.alt');
      return;
    }

    // 获取键盘组合键盘值
    const modifiersArr = Object.keys(bind.modifiers).filter((f) => bind.modifiers[f]);

    // 获取按键值
    let k = bind.arg;
    if (modifiersArr.includes('ctrl')) {
      k = k + '.ctrl';
    }
    if (modifiersArr.includes('alt')) {
      k = k + '.alt';
    }
    if (modifiersArr.includes('shift')) {
      k = k + '.shift';
    }

    if (Object.keys(keys).filter((item) => item == k).length) {
      console.error('绑定的按键 ' + k + ' 与已有的重名');
      return;
    }
    // 储存数据
    keys[k] = {
      arg: bind.arg,
      ctrl: false,
      alt: false,
      shift: false,
      funVal: bind.value,
    };
    if (modifiersArr.includes('ctrl')) {
      keys[k].ctrl = true;
    }
    if (modifiersArr.includes('alt')) {
      keys[k].alt = true;
    }
    if (modifiersArr.includes('shift')) {
      keys[k].shift = true;
    }

    window.onkeydown = function keydown(event: KeyboardEvent) {
      const { key: e_key, altKey, ctrlKey, shiftKey } = event;
      // 获取匹配项
      const matchFind = Object.values(keys).find((f_item) => {
        const { arg: i_arg, alt: i_alt, ctrl: i_ctrl, shift: i_shift } = f_item;
        return (
          (e_key.toUpperCase() === i_arg || e_key.toLowerCase() === i_arg || e_key === i_arg) && altKey === i_alt && ctrlKey === i_ctrl && shiftKey === i_shift
        );
      });

      matchFind && useThrottleFn(matchFind.funVal(), wait);
    };
  },
};
