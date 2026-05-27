<template>
  <view class="markdown-container" :style="viewStyle">
    <mp-html
      :content="htmlContent"
      :tag-style="tagStyle"
      :loading-img="loadingImg"
      :show-img-menu="showImgMenu"
      @load="onLoad"
      @error="onError"
      @imgtap="onImgTap"
    />
  </view>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import mpHtml from '../mp-html/mp-html'
import { parseMarkdown } from '../../utils/markdown-parser.js'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  viewStyle: {
    type: Object,
    default: () => ({})
  },
  customStyle: {
    type: Object,
    default: () => ({})
  },
  loadingImg: {
    type: String,
    default: ''
  },
  showImgMenu: {
    type: Boolean,
    default: true
  },
  // 是否启用流式渲染
  streaming: {
    type: Boolean,
    default: false
  },
  // 流式渲染模式: 'realtime' 实时解析 | 'complete' 完成后解析
  streamMode: {
    type: String,
    default: 'realtime',
    validator: function (value) {
      return ['realtime', 'complete'].includes(value)
    }
  },
  // 流式渲染完成标识（仅在 streamMode='complete' 时使用）
  streamComplete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['load', 'error', 'imgtap'])

const htmlContent = ref('')
const isStreaming = ref(false)

const defaultTagStyle = {
  p: 'margin: 10rpx 0; line-height: 1.6;',
  h1: 'font-size: 42rpx; font-weight: bold; margin: 34rpx 0 20rpx; padding-bottom: 16rpx; border-bottom: 2rpx solid #e5e5e5;',
  h2: 'font-size: 38rpx; font-weight: bold; margin: 28rpx 0 20rpx; padding-bottom: 12rpx; border-bottom: 2rpx solid #e5e5e5;',
  h3: 'font-size: 34rpx; font-weight: bold; margin: 24rpx 0 16rpx;',
  h4: 'font-size: 30rpx; font-weight: bold; margin: 20rpx 0 16rpx;',
  h5: 'font-size: 28rpx; font-weight: bold; margin: 20rpx 0 12rpx;',
  h6: 'font-size: 26rpx; font-weight: bold; margin: 16rpx 0 12rpx;',
  ul: 'margin: 14rpx 0; padding-left: 40rpx;',
  ol: 'margin: 14rpx 0; padding-left: 40rpx;',
  li: 'margin: 8rpx 0; line-height: 1.6;',
  blockquote:
    'margin: 18rpx 0; padding: 16rpx 24rpx; background: #f5f5f5; border-left: 8rpx solid #42b983; color: #666;',
  code: 'padding: 4rpx 12rpx; margin: 0 4rpx; background: #f5f5f5; border-radius: 6rpx; font-family: Consolas, Monaco, monospace; font-size: 26rpx; color: #e83e8c;',
  pre: 'margin: 18rpx 0; padding: 24rpx; background: #f6f8fa; border-radius: 10rpx; overflow-x: auto; font-family: Consolas, Monaco, monospace; font-size: 26rpx; line-height: 1.5;',
  a: 'color: #42b983; text-decoration: none;',
  img: 'max-width: 100%; height: auto; margin: 16rpx 0; border-radius: 10rpx;',
  table:
    'margin: 18rpx 0; border-collapse: collapse; width: max-content; min-width: 100%; border: 2rpx solid #ddd;',
  thead: 'background: #f5f5f5;',
  tbody: '',
  tr: 'border-bottom: 2rpx solid #ddd;',
  th: 'padding: 16rpx 24rpx; border: 2rpx solid #ddd; background: #f5f5f5; font-weight: bold; text-align: left;',
  td: 'padding: 16rpx 24rpx; border: 2rpx solid #ddd; min-width: 100rpx;',
  hr: 'margin: 28rpx 0; border: none; border-top: 2rpx solid #e5e5e5;',
  strong: 'font-weight: bold;',
  em: 'font-style: italic;',
  del: 'text-decoration: line-through;'
}

const tagStyle = computed(() => {
  return { ...defaultTagStyle, ...props.customStyle }
})

watch(
  () => props.content,
  function (newVal) {
    if (props.streaming && props.streamMode === 'realtime') {
      // 实时解析模式：边流式边解析 markdown
      htmlContent.value = parseMarkdown(newVal)
    } else if (
      props.streaming &&
      props.streamMode === 'complete' &&
      !props.streamComplete
    ) {
      // 完成后解析模式：流式中显示纯文本
      isStreaming.value = true
      htmlContent.value =
        '<p>' +
        newVal
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br>') +
        '</p>'
    } else {
      // 非流式模式或流式完成：正常解析 markdown
      isStreaming.value = false
      htmlContent.value = parseMarkdown(newVal)
    }
  },
  { immediate: true }
)

// 监听流式完成状态（仅在 streamMode='complete' 时生效）
watch(
  () => props.streamComplete,
  function (isComplete) {
    if (isComplete && props.streaming && props.streamMode === 'complete') {
      // 流式完成，重新解析 markdown
      isStreaming.value = false
      htmlContent.value = parseMarkdown(props.content)
    }
  }
)

function onLoad() {
  emit('load')
}

function onError(e) {
  emit('error', e)
}

function onImgTap(e) {
  emit('imgtap', e)
}
</script>

<style scoped>
.markdown-container {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  line-height: 1.6;
  font-size: 28rpx;
}

.markdown-container >>> .mp-html {
  margin: 0;
  padding: 0;
}

.markdown-container >>> .mp-html > view:first-child {
  margin-top: 0 !important;
}

.markdown-container >>> .mp-html > view:last-child {
  margin-bottom: 0 !important;
}

.markdown-container >>> text:empty {
  display: none;
}

.markdown-container >>> text {
  line-height: inherit;
  min-height: 0;
  height: auto;
}
</style>
