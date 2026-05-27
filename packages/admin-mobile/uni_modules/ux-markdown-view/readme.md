# ux-markdown-view

基于 mp-html 的 Markdown 渲染组件，支持流式渲染、表格、代码高亮等功能。

## 特性

- ✅ 支持标准 Markdown 语法
- ✅ 支持表格渲染
- ✅ 支持流式渲染（实时解析/完成后解析）
- ✅ 支持自定义样式
- ✅ 全平台兼容（H5/小程序/App）
- ✅ 零外部依赖
- ✅ 响应式单位（rpx）

## 安装

### 方式一：插件市场导入
在 [DCloud 插件市场](https://ext.dcloud.net.cn/) 搜索 `ux-markdown-view`，点击导入到项目。

### 方式二：手动导入
将 `uni_modules/ux-markdown-view` 目录复制到项目的 `uni_modules` 目录下。

## 使用方法

> 建议放到分包里手动引入该插件

**符合`easycom`组件模式, 导入 `uni_modules` 后直接使用即可 **

### 普通渲染示例

```html
<template>
  <view class="container">
    <!-- 默认用法 直接传入md文本即可 普通md展示-->
    <ux-markdown-view 
      :markdown="content" 
      :custom-style="customStyle" 
      :show-img-menu="true" 
      @load="handleLoad"
      @imgtap="handleImgTap">
    </ux-markdown-view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
  
const content = ref('## md格式的文本内容')
  
// 自定义样式
const viewStyle = ref({
  fontSize: '30rpx'
})
const customStyle = ref({
  table:
    'margin: 16rpx 0; border-collapse: collapse; width: 100%; border: 2rpx solid #ddd; background: #fff; font-size: 26rpx;'
})

const handleLoad = () => {
  console.log('内容加载完成')
}

const handleImgTap = (e) => {
  console.log('图片点击', e)
  // 可以实现图片预览功能
  uni.previewImage({
    urls: [e.detail.src]
  })
}
</script>
<style lang="scss" scoped></style>
```

### 流式渲染
```vue
<template>
  <ux-markdown-view 
    :content="streamContent"
    :streaming="true"
    stream-mode="realtime"
  >
  </ux-markdown-view>
</template>

<script setup>
import { ref } from 'vue'

const streamContent = ref('')

// 模拟流式数据
function startStream() {
  const text = '# Hello\n这是**流式**渲染'
  let i = 0
  const timer = setInterval(() => {
    if (i < text.length) {
      streamContent.value += text[i++]
    } else {
      clearInterval(timer)
    }
  }, 50)
}
</script>
```

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | String | '' | markdown 内容 |
| viewStyle | Object | {} | 自定义字体样式等 |
| customStyle | Object | {} | 自定义tag样式 |
| streaming | Boolean | false | 是否启用流式渲染 |
| streamMode | String | 'realtime' | 流式模式：'realtime' \| 'complete' |
| streamComplete | Boolean | false | 流式是否完成 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| load | 加载完成 | - |
| error | 加载错误 | error |
| imgtap | 图片点击 | event |

## 支持的 Markdown 语法

- 标题 (H1-H6)
- 粗体/斜体/删除线
- 列表（有序/无序）
- 引用
- 代码块/行内代码
- 链接
- 图片
- 表格
- 水平线

## 注意事项

1. 表格在小程序中可能需要横向滚动
2. 代码块不支持语法高亮（可自行扩展）

## 更新日志

见 [changelog.md](./changelog.md)

## 许可证

MIT
📄 changelog.md
markdown# 更新日志

## 1.1.0 (2025-12-23)

### Features
- 支持标准 Markdown 语法
- 支持流式渲染（实时/完成后）
- 支持表格渲染
- 支持自定义样式
- 零外部依赖