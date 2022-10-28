<template>
  <n-card :bordered="false" class="proCard">
    <form-search
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <div class="table-toolbar">
      <!--顶部左侧区域-->
      <div class="flex items-center table-toolbar-left">
        <n-button type="primary" @click="addUpdateModelRef.init()">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </div>

      <div class="flex items-center table-toolbar-right">
        <!--刷新-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="table-toolbar-right-icon" @click="loadDataTable">
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
      </div>
    </div>
    <n-data-table :size="tableSize" :loading="tableLoading" :columns="columns" :data="tableData" :row-key="rowKey" />
    <add-update-model ref="addUpdateModelRef" @refurbish="loadDataTable" />
  </n-card>
</template>
<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue';
  import { articleCategoryAPi } from '@/api';
  import { useConfigure } from './configure';
  import { ReloadOutlined, ColumnHeightOutlined, PlusOutlined } from '@/utils';
  import FormSearch from '@/components/form/form-search.vue';
  import AddUpdateModel from './add-update-model.vue';

  const addUpdateModelRef = ref();

  // 配置表格密度
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
  const tableSize = ref('medium');

  // 表格
  const tableData = ref<any>([]);
  const rowKey = (row) => row.name;
  const tableLoading = ref(false);

  /**
   * 表格
   *  */
  // 获取接口数据
  let searchParams = {};
  const loadDataTable = () => {
    tableLoading.value = true;
    articleCategoryAPi
      .getArticleCategoryAll({ ...searchParams })
      .then((res) => {
        tableData.value = res;
      })
      .finally(() => {
        tableLoading.value = false;
      });
  };

  // 配置
  const { searchSchemas, columns } = useConfigure({ loadDataTable });

  /**
   * 查询
   *  */
  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams = values;
    loadDataTable();
  };

  //密度切换
  const densitySelect = (e) => {
    tableSize.value = e;
  };

  onMounted(() => {
    nextTick(() => {
      loadDataTable();
    });
  });
</script>
<style lang="scss" scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 16px 0;

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;

      &-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        font-weight: 600;
      }
    }

    &-right {
      display: flex;
      justify-content: flex-end;
      flex: 1;

      &-icon {
        margin-left: 12px;
        font-size: 16px;
        cursor: pointer;
        color: var(--text-color);

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
