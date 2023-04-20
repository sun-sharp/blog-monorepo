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

// 判断类型
const ifType = (el: Element): boolean => {
  return el.tagName == 'INPUT' || el.tagName == 'TEXTAREA';
};

// 等待时间
const wait = 100;

// 监听键盘使用
export const pressKey: ObjectDirective = {
  mounted(el, bind) {
    // 判断是否是 input 或者 textarea 由于 el-input是一个div元素且它的下级才是input 故此获取children
    const inputNode = ifType(el) ? el : el.children.length && ifType(el.children[0]) ? el.children[0] : undefined;

    if (!bind.arg) {
      console.error('请绑定需要触发的键，例如v-press-key:s，v-press-key:s.alt');
      return;
    }

    // 获取键盘组合键盘值
    const modifiersArr = Object.keys(bind.modifiers).filter((f) => bind.modifiers[f]);
    // 获取id
    const modifiersIds = modifiersArr.filter((f) => !['ctrl', 'alt', 'shift'].includes(f));
    const id = modifiersIds.length ? modifiersIds[0] : '';

    // 获取按键值
    let keypad = bind.arg;
    if (modifiersArr.includes('ctrl')) {
      keypad = keypad + '.ctrl';
    }
    if (modifiersArr.includes('alt')) {
      keypad = keypad + '.alt';
    }
    if (modifiersArr.includes('shift')) {
      keypad = keypad + '.shift';
    }

    if (Object.keys(keys).filter((item) => item == keypad).length) {
      console.error('绑定的按键 ' + keypad + ' 与已有的重名');
      return;
    }

    // 获取对象键值
    const k = inputNode !== undefined ? keypad + '-' + inputNode.tagName + (id ? '-' + id : '') : keypad;
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

    // // 绑定在input上时
    // if (inputNode !== undefined) {
    //   inputNode.onkeydown = function keydown(event: KeyboardEvent) {
    //     // 获取匹配项
    //     const match = Object.keys(keys).filter((item) => {
    //       const key = item.split('-')[0];
    //       return event.key.toUpperCase() == key || event.key.toLowerCase() == key || event.key == key;
    //     });

    //     useThrottleFn(match.length && keys[match[0].split('-')[0] + '-' + inputNode.tagName + (id ? '-' + id : '')].funVal(), wait);
    //   };

    //   return;
    // }

    window.onkeydown = function keydown(event: KeyboardEvent) {
      console.log(event, 'event');

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
