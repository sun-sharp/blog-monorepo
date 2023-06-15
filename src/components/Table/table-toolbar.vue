<template>
  <div class="app-table-toolbar">
    <!--顶部左侧区域-->
    <div class="flex items-center app-table-toolbar__left">
      <slot name="tableTitle"></slot>
    </div>

    <div class="flex items-center app-table-toolbar__right">
      <!--顶部右侧区域-->
      <slot name="toolbar"></slot>

      <!--刷新-->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="app-table-toolbar__right-icon" @click="reloadClick">
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
          <div class="app-table-toolbar__right-icon">
            <n-dropdown :value="dropdownSize" trigger="click" :options="densityOptions" @select="densitySelect">
              <n-icon size="18">
                <ColumnHeightOutlined />
              </n-icon>
            </n-dropdown>
          </div>
        </template>
        <span>密度</span>
      </n-tooltip>

      <!--表格设置单独抽离成组件-->
    </div>
  </div>
</template>

<script lang="ts">
  import { ColumnHeightOutlined, ReloadOutlined } from '@/utils';
  import { defineComponent } from 'vue';

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
    name: 'AppTableToolbar',
    components: {
      ReloadOutlined,
      ColumnHeightOutlined,
    },
    props: {
      dropdownSize: {
        type: String,
        default: 'medium',
      },
    },
    emits: ['reload', 'update:dropdownSize'],
    setup(_props, { emit }) {
      // 刷新
      const reloadClick = () => {
        emit('reload');
      };

      //密度切换
      const densitySelect = (val: string) => {
        emit('update:dropdownSize', val);
      };

      return {
        densityOptions,
        reloadClick,
        densitySelect,
      };
    },
  });
</script>
<style lang="scss" scoped>
  .app-table-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 16px 0;

    &__left {
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

    &__right {
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
</style>
