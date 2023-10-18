<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import TableToolbar from './TableToolbar.vue';
  import { BasicColumn, TableSizeType } from '/#/components/table';

  const props = defineProps({
    // 通过行数据创建行的 key（如果你不想给每一行加上 key）
    rowKey: {
      type: [String, Function] as PropType<string | ((record: any) => string)>,
    },
    data: {
      type: [Array],
      default: () => [],
    },
    // 需要展示的列
    columns: {
      type: [Array] as PropType<BasicColumn[]>,
      default: () => [],
      required: true,
    },
    // 最大高度
    maxHeight: {
      type: [Number, String],
    },
    // 表格内容的横向宽度，如果列被水平固定了，则需要设定它
    scrollX: {
      type: [Number, String],
    },
    rowClassName: {
      type: [String, Function] as PropType<string | ((record: any) => string)>,
    },
    // 表格头部标题
    title: {
      type: String,
    },
    // 表格头部标题信息
    titleTooltip: {
      type: String,
    },
  });

  const emit = defineEmits(['reload']);

  const tableSize = ref<TableSizeType>('medium');
  const tableLoading = ref(false);

  const getRowKey = computed(() => {
    const { rowKey } = props;
    return rowKey
      ? rowKey
      : () => {
          return 'key';
        };
  });

  const getTableBind = computed(() => {
    return {
      rowKey: unref(getRowKey),
      data: props.data,
      columns: props.columns,
      maxHeight: props.maxHeight,
      scrollX: props.scrollX,
      rowClassName: props.rowClassName,
      loading: unref(tableLoading),
      size: unref(tableSize),
    };
  });

  const getTableToolbarProps = computed(() => {
    return {
      title: props.title,
      titleTooltip: props.titleTooltip,
      hasColumnSetting: false,
    };
  });

  // 刷新
  const reloadClick = () => {
    emit('reload');
  };
</script>

<template>
  <table-toolbar v-model:size="tableSize" v-bind="getTableToolbarProps" @reload="reloadClick">
    <template #tableTitle>
      <slot name="tableTitle"></slot>
    </template>
    <template #toolbar>
      <slot name="toolbar"></slot>
    </template>
  </table-toolbar>
  <div class="table-all">
    <n-data-table v-bind="getTableBind" />
  </div>
</template>
