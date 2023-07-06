<script lang="ts" setup>
  import { intUnitPx } from '@/utils';
  import { onClickOutside } from '@vueuse/core';
  import { computed, ref, watch } from 'vue';
  import { setupMove, useDragDot } from './useDragDot';
  import { DragProps } from './useDragResize';
  import { IDragData, resizeEmitType } from '/#/views/dashboard';

  const props = defineProps(DragProps);

  const emits = defineEmits(['elementMouseDown', 'itemClickOutside', 'resize', 'resizeStart', 'resizeEnd', 'dragStart', 'drag', 'dragEnd']);

  // 设置一个遍历用来保存动态的ref对象
  const sharpDragResizeRef = ref();

  const dragData = ref<IDragData>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  const dragStyle = computed(() => {
    const { width, height, left, top } = dragData.value;
    return {
      width: intUnitPx(width),
      height: intUnitPx(height),
      left: intUnitPx(left),
      top: intUnitPx(top),
    };
  });

  // 按下

  const isMousedown = ref(false);
  const elementMouseDown = (ev: MouseEvent) => {
    // 阻止冒泡事件
    ev.stopPropagation();
    isMousedown.value = true;

    emits('elementMouseDown', ev);

    // 处理拖拽
    const { clientX: downX, clientY: downY } = ev;
    const { width, height, left, top } = dragData.value;
    const el = sharpDragResizeRef.value;
    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0;
    // 设置边界
    const parentEl = el.parentElement || document.body;
    const parentElRect = parentEl!.getBoundingClientRect();
    // 最大x
    maxX = parentElRect.width - width;
    // 最大y
    maxY = parentElRect.height - height;

    // 鼠标在盒子里的位置
    const mouseX = downX - left;
    const mouseY = downY - top;
    emits('dragStart', dragData.value);
    const onMousemove = (e: MouseEvent) => {
      let moveX = e.clientX - mouseX;
      let moveY = e.clientY - mouseY;

      // 判断x最小最大边界
      moveX = moveX < minX ? minX : moveX;
      moveX = moveX > maxX ? maxX : moveX;

      // 判断y最小最大边界
      moveY = moveY < minY ? minY : moveY;
      moveY = moveY > maxY ? maxY : moveY;

      dragData.value.left = moveX;
      dragData.value.top = moveY;

      emits('drag', dragData.value);
    };

    setupMove(onMousemove, () => {
      isMousedown.value = false;
      emits('dragEnd', dragData.value);
    });
  };

  // 点击内容之外
  onClickOutside(sharpDragResizeRef, (ev: PointerEvent) => {
    emits('itemClickOutside', ev);
  });

  const resizeEmitFun = (type: resizeEmitType, ...args: any) => {
    emits(type, ...args);
  };

  const { dotList, onDotMousedown } = useDragDot(dragData, props, resizeEmitFun);

  watch(
    () => [props.width, props.height, props.left, props.top],
    ([width, height, left, top]) => {
      dragData.value = { width, height, left, top };
    },
    {
      immediate: true,
      deep: true,
    }
  );
</script>

<template>
  <div ref="sharpDragResizeRef" :class="['sharp-drag-resize', { dragging: isMousedown }]" :style="dragStyle" @mousedown="elementMouseDown">
    <div :class="['sharp-drag-resize__main', { selected, space: hasSpace }]">
      <slot></slot>

      <div v-show="selected" class="sharp-drag-resize__dot">
        <div
          v-for="(item, index) in dotList"
          :key="index"
          class="dot-item"
          :data-side="item.side"
          :style="{ ...item }"
          @mousedown="onDotMousedown($event, item)"
        >
          <slot name="resize" v-bind="{ side: item.side }">
            <div class="dot-item-handle"></div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .sharp-drag-resize {
    position: absolute;
    z-index: auto;
    width: 200px;
    height: 120px;
    transition: 0.5s left top ease;
    user-select: auto;

    &.dragging {
      user-select: none;
    }

    &__main {
      position: absolute;
      background-color: #fff;
      border-color: transparent;
      border-style: solid;
      border-width: 1px;
      inset: 0;

      &.space {
        inset: 3px;
      }

      &.selected {
        border-color: $-theme-color;

        &:hover {
          border-style: solid;
          cursor: move;
        }
      }

      &:hover {
        border-color: $-theme-color;
        border-style: dashed;
        cursor: move;
      }
    }

    &__dot {
      .dot-item {
        position: absolute;
        transform: translate(-50%, -50%);
        cursor: se-resize;

        &[data-side*='right'] {
          transform: translate(50%, -50%);
        }

        &[data-side*='bottom'] {
          transform: translate(-50%, 50%);
        }

        &[data-side='bottom-right'] {
          transform: translate(50%, 50%);
        }

        &-handle {
          width: 6px;
          height: 6px;
          background-color: var(--sharp-drag-color, $-theme-color);
          border-radius: 50%;
        }
      }
    }
  }
</style>
