<template>
  <div class="table-toolbar">
    <!--顶部左侧区域-->
    <div class="flex items-center table-toolbar-left">
      <template v-if="getProps.title">
        <div class="table-toolbar-left-title">
          {{ getProps.title }}
          <n-tooltip v-if="getProps.titleTooltip" trigger="hover">
            <template #trigger>
              <n-icon size="18" class="ml-1 cursor-pointer text-gray-400">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            {{ getProps.titleTooltip }}
          </n-tooltip>
        </div>
      </template>
      <slot name="tableTitle"></slot>
    </div>

    <div class="flex items-center table-toolbar-right">
      <!--顶部右侧区域-->
      <slot name="toolbar"></slot>

      <!--刷新-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon" @click="reload">
            <n-icon size="18">
              <ReloadOutlined />
            </n-icon>
          </div>
        </template>
        <span>刷新</span>
      </n-tooltip>

      <!--密度-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon">
            <n-dropdown v-model:value="tableSize" trigger="click" :options="densityOptions" @select="densitySelect">
              <n-icon size="18">
                <ColumnHeightOutlined />
              </n-icon>
            </n-dropdown>
          </div>
        </template>
        <span>密度</span>
      </n-tooltip>

      <!--表格设置单独抽离成组件-->
      <ColumnSetting />
    </div>
  </div>
  <div class="s-table">
    <n-data-table
      ref="tableElRef"
      v-bind="getBindValues"
      :pagination="pagination"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
      @on-update:checked-row-keys="updateCheckedRowKeys"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </n-data-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { QuestionCircleOutlined, ColumnHeightOutlined, ReloadOutlined } from '@/utils/icons';
  import ColumnSetting from './table-column-setting.vue';
  import { BasicTableProps } from './hooks/useBasicTable';
  import { useLoading } from './hooks/useLoading';
  import { usePagination } from './hooks/usePagination';
  import { useDataSource } from './hooks/useDataSource';

  const props = defineProps(BasicTableProps);

  const emit = defineEmits(['fetch-success', 'fetch-error', 'update:checked-row-keys', 'edit-end', 'edit-cancel', 'edit-row-end', 'edit-change']);

  const deviceHeight = ref(150);
  const tableElRef = ref();
  const wrapRef = ref<Nullable<HTMLDivElement>>(null);
  let paginationEl: HTMLElement | null;

  const tableData = ref<Recordable[]>([]);

  const { getLoading, setLoading } = useLoading(props);

  const { getPaginationInfo, setPagination } = usePagination(props);

  const { getDataSourceRef, getRowKey, reload } = useDataSource(props, emit, {
    getPaginationInfo,
    setPagination,
    tableData,
    setLoading,
  });

  const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } = useColumns(getProps);

  const state = reactive({
    tableSize: unref(getProps).size || 'medium',
    isColumnSetting: false,
  });

  //页码切换
  const updatePage = (current: number) => {
    setPagination({ current });
    reload();
  };

  //分页数量切换
  const updatePageSize = (size: number) => {
    setPagination({ current: 1, pageSize: size });
    reload();
  };

  //密度切换
  const densitySelect = (e: number) => {
    state.tableSize = e;
  };

  //选中行
  const updateCheckedRowKeys = (rowKeys) => {
    emit('update:checked-row-keys', rowKeys);
  };

  //获取表格大小
  const getTableSize = computed(() => state.tableSize);

  //组装表格信息
  const getBindValues = computed(() => {
    const tableData = unref(getDataSourceRef);
    const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : 'auto';
    return {
      ...unref(getProps),
      loading: unref(getLoading),
      columns: toRaw(unref(getPageColumns)),
      rowKey: unref(getRowKey),
      data: tableData,
      size: unref(getTableSize),
      remote: true,
      'max-height': maxHeight,
    };
  });

  //获取分页信息
  const pagination = computed(() => toRaw(unref(getPaginationInfo)));

  const tableAction = {
    reload,
    setColumns,
    setLoading,
    getColumns,
    getPageColumns,
    getCacheColumns,
    setCacheColumnsField,
    emit,
  };

  const getCanResize = computed(() => {
    const { canResize } = unref(getProps);
    return canResize;
  });

  async function computeTableHeight() {
    const table = unref(tableElRef);
    if (!table) return;
    if (!unref(getCanResize)) return;
    const tableEl = table?.$el;
    const headEl = tableEl.querySelector('.n-data-table-thead ');
    const { bottomIncludeBody } = getViewportOffset(headEl);
    const headerH = 64;
    let paginationH = 2;
    let marginH = 24;
    let borderH = 1;
    if (!isBoolean(pagination)) {
      paginationEl = tableEl.querySelector('.n-data-table__pagination') as HTMLElement;
      if (paginationEl) {
        const offsetHeight = paginationEl.offsetHeight;
        paginationH += offsetHeight || 0;
      } else {
        paginationH += 28;
      }
    }
    let height = bottomIncludeBody - (headerH + paginationH + marginH + borderH + (props.resizeHeightOffset || 0));
    const maxHeight = props.maxHeight;
    height = maxHeight && maxHeight < height ? maxHeight : height;
    deviceHeight.value = height;
  }

  useWindowSizeFn(computeTableHeight, 280);

  onMounted(() => {
    nextTick(() => {
      computeTableHeight();
    });
  });

  createTableContext({ ...tableAction, wrapRef, getBindValues });
</script>

<!-- <script lang="ts">
  import { ref, defineComponent, reactive, unref, toRaw, computed, toRefs, onMounted, nextTick, PropType, ExtractPropTypes } from 'vue';
  import { ReloadOutlined, ColumnHeightOutlined, QuestionCircleOutlined, getViewportOffset, isBoolean, propTypes } from '@/utils';
  import ColumnSetting from './table-column-setting.vue';
  import { useColumns, useDataSource, useLoading, usePagination, useWindowSizeFn, createTableContext } from '@/hooks';
  import { BasicTableProps } from './props/basic-table';

  const densityOptions = [
    {
      type: 'menu',
      label: '紧凑',
      key: 'small',
    },
    {
      type: 'menu',
      label: '默认',
      key: 'medium',
    },
    {
      type: 'menu',
      label: '宽松',
      key: 'large',
    },
  ];

  export default defineComponent({
    components: {
      ReloadOutlined,
      ColumnHeightOutlined,
      ColumnSetting,
      QuestionCircleOutlined,
    },
    props: BasicTableProps,
    emits: ,
    setup(props: ExtractPropTypes<typeof BasicTableProps>, { emit }) {
      const deviceHeight = ref(150);
      const tableElRef = ref();
      const wrapRef = ref<Nullable<HTMLDivElement>>(null);
      let paginationEl: HTMLElement | null;

      const tableData = ref<Recordable[]>([]);

      const { getLoading, setLoading } = useLoading(props);

      const { getPaginationInfo, setPagination } = usePagination(getProps);

      const { getDataSourceRef, getRowKey, reload } = useDataSource(
        getProps,
        {
          getPaginationInfo,
          setPagination,
          tableData,
          setLoading,
        },
        emit
      );

      const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } = useColumns(getProps);

      const state = reactive({
        tableSize: unref(getProps).size || 'medium',
        isColumnSetting: false,
      });

      //页码切换
      const updatePage = (page: number) => {
        setPagination({ page: page });
        reload();
      };

      //分页数量切换
      const updatePageSize = (size: number) => {
        setPagination({ page: 1, pageSize: size });
        reload();
      };

      //密度切换
      const densitySelect = (e: number) => {
        state.tableSize = e;
      };

      //选中行
      const updateCheckedRowKeys = (rowKeys) => {
        emit('update:checked-row-keys', rowKeys);
      };

      //获取表格大小
      const getTableSize = computed(() => state.tableSize);

      //组装表格信息
      const getBindValues = computed(() => {
        const tableData = unref(getDataSourceRef);
        const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : 'auto';
        return {
          ...unref(getProps),
          loading: unref(getLoading),
          columns: toRaw(unref(getPageColumns)),
          rowKey: unref(getRowKey),
          data: tableData,
          size: unref(getTableSize),
          remote: true,
          'max-height': maxHeight,
        };
      });

      //获取分页信息
      const pagination = computed(() => toRaw(unref(getPaginationInfo)));

      const tableAction = {
        reload,
        setColumns,
        setLoading,
        getColumns,
        getPageColumns,
        getCacheColumns,
        setCacheColumnsField,
        emit,
      };

      const getCanResize = computed(() => {
        const { canResize } = unref(getProps);
        return canResize;
      });

      async function computeTableHeight() {
        const table = unref(tableElRef);
        if (!table) return;
        if (!unref(getCanResize)) return;
        const tableEl = table?.$el;
        const headEl = tableEl.querySelector('.n-data-table-thead ');
        const { bottomIncludeBody } = getViewportOffset(headEl);
        const headerH = 64;
        let paginationH = 2;
        let marginH = 24;
        let borderH = 1;
        if (!isBoolean(pagination)) {
          paginationEl = tableEl.querySelector('.n-data-table__pagination') as HTMLElement;
          if (paginationEl) {
            const offsetHeight = paginationEl.offsetHeight;
            paginationH += offsetHeight || 0;
          } else {
            paginationH += 28;
          }
        }
        let height = bottomIncludeBody - (headerH + paginationH + marginH + borderH + (props.resizeHeightOffset || 0));
        const maxHeight = props.maxHeight;
        height = maxHeight && maxHeight < height ? maxHeight : height;
        deviceHeight.value = height;
      }

      useWindowSizeFn(computeTableHeight, 280);

      onMounted(() => {
        nextTick(() => {
          computeTableHeight();
        });
      });

      createTableContext({ ...tableAction, wrapRef, getBindValues });

      return {
        ...toRefs(state),
        tableElRef,
        getBindValues,
        densityOptions,
        reload,
        densitySelect,
        updatePage,
        updatePageSize,
        pagination,
        tableAction,
        updateCheckedRowKeys,
        getProps,
      };
    },
  });
</script> -->

<style lang="scss" scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 16px;

    &-left {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-start;

      &-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-weight: 600;
        font-size: 16px;
      }
    }

    &-right {
      display: flex;
      flex: 1;
      justify-content: flex-end;

      &-icon {
        margin-left: 12px;
        color: var(--text-color);
        font-size: 16px;
        cursor: pointer;

        :hover {
          color: #1890ff;
        }
      }
    }
  }

  .table-toolbar-inner-popover-title {
    padding: 2px 0;
  }
</style>
