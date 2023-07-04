<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  const box1 = ref();
  const box2 = ref();
  const child = ref();

  // 在元素被拖动时触发
  const handleDrag = () => {
    console.log('🚀🚀 ~ drag  触发啦');
  };
  // 在元素开始被拖动时触发
  const handleDragstart = () => {
    console.log('🚀🚀 ~ dragstart  触发啦');
    // ev.dataTransfer.setData('id', ev.target.id);
  };
  // 在拖动操作完成时触发
  const handleDragend = () => {
    console.log('🚀🚀 ~ dragend  触发啦');
  };
  // 当被拖动元素进入到释放区所占据的屏幕空间时触发
  const handleDragenter = () => {
    console.log('🚀🚀 ~ dragenter  触发啦');
  };
  // 当被拖动元素在释放区内移动时触发
  const handleDragover = (ev) => {
    ev.preventDefault();
    console.log('🚀🚀 ~ dragover  触发啦');
  };
  // 当被拖动元素没有放下就离开释放区时触发
  const handleDragleave = () => {
    console.log('🚀🚀 ~ dragleave  触发啦');
  };
  // 当被拖动元素在释放区里放下时触发
  const handleDrop = (ev) => {
    console.log('🚀🚀 ~ drop  触发啦');
    ev.preventDefault();
    // const data = ev.dataTransfer.getData('id');
    // ev.target.appendChild(document.getElementById(data));
  };

  onMounted(() => {});
</script>

<template>
  <div class="sharp-draggable">
    <div ref="box1" class="box">
      <div ref="child" draggable="true" class="child" @drag="handleDrag" @dragstart="handleDragstart" @dragend="handleDragend"></div>
    </div>
    <div ref="box2" class="box" @dragenter="handleDragenter" @dragover="handleDragover" @dragleave="handleDragleave" @drop="handleDrop"></div>
  </div>
</template>

<style lang="scss">
  .sharp-draggable {
    .box {
      width: 200px;
      height: 200px;
      margin-bottom: 10px;
      background-color: #e4e4e4;
    }

    .child {
      width: 100px;
      height: 100px;
      background-color: #5f5f5f;
    }
  }
</style>
