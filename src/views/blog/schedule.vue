<script lang="ts" setup>
  import { useConfigure } from './hooks/useScheduleConfigure';
  import { PlusOutlined } from '@/utils';
  import FormSearch from '@/components/form/FormSearch.vue';
  import BasicTable from '@/components/table/BasicTable.vue';
  import ScheduleAddUpdateModel from './components/ScheduleAddUpdateModel.vue';

  const { actionRef, addUpdateModelRef, searchSchemas, columns, searchSubmit, loadDataTable, tableRowKey, tableCheckedRowKeys, reloadTable } = useConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit" />
    <basic-table
      ref="actionRef"
      is-card-surround
      :columns="columns"
      :request="loadDataTable"
      :row-key="tableRowKey"
      :scroll-x="1090"
      has-selection
      @update:checked-row-keys="tableCheckedRowKeys">
      <template #tableTitle>
        <n-space>
          <n-button type="primary" @click="addUpdateModelRef.init()">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>
        </n-space>
      </template>
    </basic-table>
    <schedule-add-update-model ref="addUpdateModelRef" @finish="reloadTable" />
  </n-card>
</template>
