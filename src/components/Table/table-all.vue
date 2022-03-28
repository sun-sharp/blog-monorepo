<template>
  <table-toolbar v-model:dropdown-size="tableSize" @reload="reloadClick">
    <template #tableTitle><slot name="tableTitle"></slot></template>
    <template #toolbar><slot name="toolbar"></slot></template>
  </table-toolbar>
  <div class="s-table">
    <n-data-table v-bind="getTableBind" :size="tableSize" :loading="tableLoading" />
  </div>
</template>

<script lang="ts">
  import { NDataTable } from 'naive-ui/lib/components';
  import { ref, defineComponent, computed } from 'vue';
  import TableToolbar from './table-toolbar.vue';

  export default defineComponent({
    components: {
      TableToolbar,
    },
    props: {
      ...NDataTable.props, // 这里继承原 UI 组件的 props
    },
    emits: ['reload'],
    setup(props, { emit }) {
      const tableSize = ref('medium');
      const tableLoading = ref(false);

      const getTableBind = computed(() => {
        return {
          rowKey: props.rowKey,
          data: props.data,
          columns: props.columns,
          actionColumn: props.actionColumn,
        };
      });

      // 刷新
      const reloadClick = () => {
        emit('reload');
      };

      //密度切换
      const densitySelect = (val: string) => {
        tableSize.value = val;
      };

      return {
        tableSize,
        tableLoading,
        getTableBind,
        reloadClick,
        densitySelect,
      };
    },
  });
</script>
<style lang="scss" scoped></style>
