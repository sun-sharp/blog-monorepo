<template>
  <n-data-table v-bind="getTableBind" :size="tableSize" :loading="tableLoading" />
</template>

<script lang="ts">
  import { NDataTable } from 'naive-ui/lib/components';
  import { ref, defineComponent, computed } from 'vue';

  export default defineComponent({
    components: {},
    props: {
      ...NDataTable.props, // 这里继承原 UI 组件的 props
    },
    emits: [],
    setup(props) {
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

      return {
        tableSize,
        tableLoading,
        getTableBind,
      };
    },
  });
</script>
<style lang="scss" scoped></style>
