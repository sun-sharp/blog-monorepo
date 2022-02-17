<template>
  <div class="app-table-action">
    <div class="flex items-center justify-center">
      <n-button v-for="(action, index) in getActions" :key="`${index}-${action.label}`" v-bind="action" class="mh-3">
        <template v-if="action.icon" #icon>
          <n-icon>
            <component :is="action.icon" />
          </n-icon>
        </template>
        {{ action.label }}
      </n-button>
      <n-dropdown v-if="dropDownActions && getDropdownList.length" trigger="hover" :options="getDropdownList" @select="select">
        <slot name="more"></slot>
        <n-button v-if="!$slots.more" v-bind="getMoreProps" class="mh-3" icon-placement="right">
          <div class="flex items-center">
            <span>更多</span>
            <n-icon size="14" class="ml-1">
              <DownOutlined />
            </n-icon>
          </div>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed, toRaw } from 'vue';
  import { isBoolean, isFunction } from '@/utils';
  import { DeleteOutlined, DownOutlined } from '@/utils/icons';
  import { ActionItem } from '/#/components/table';

  export default defineComponent({
    name: 'AppTableAction',
    components: { DeleteOutlined, DownOutlined },
    props: {
      actions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
        required: true,
      },
      dropDownActions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
      },
      style: {
        type: String as PropType<String>,
        default: 'button',
      },
      select: {
        type: Function as PropType<Function>,
        default: () => {},
      },
      dropDownType: {
        type: String as PropType<String>,
        default: 'default',
      },
      dropDownColor: {
        type: String as PropType<String>,
        default: undefined,
      },
      dropDownText: {
        type: Boolean as PropType<Boolean>,
        default: false,
      },
      dropDownTextColor: {
        type: String as PropType<String>,
        default: undefined,
      },
      size: {
        type: String as PropType<String>,
        default: 'small',
      },
    },
    setup(props) {
      const getMoreProps = computed(() => {
        return {
          text: props.dropDownText,
          type: props.dropDownType,
          color: props.dropDownColor,
          size: props.size,
          'text-color': props.dropDownTextColor,
        };
      });

      const getDropdownList = computed(() => {
        return (toRaw(props.dropDownActions) || [])
          .filter((action) => {
            return isIfShow(action);
          })
          .map((action) => {
            const { popConfirm } = action;
            return {
              size: props.size,
              ...action,
              ...popConfirm,
              onConfirm: popConfirm?.confirm,
              onCancel: popConfirm?.cancel,
            };
          });
      });

      const isIfShow = (action: ActionItem): boolean => {
        const ifShow = action.ifShow;

        let isIfShow = true;

        if (isBoolean(ifShow)) {
          isIfShow = ifShow;
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(action);
        }
        return isIfShow;
      };

      const getActions = computed(() => {
        return (toRaw(props.actions) || [])
          .filter((action: any) => {
            return isIfShow(action);
          })
          .map((action) => {
            const { popConfirm } = action;
            //需要展示什么风格，自己修改一下参数
            return {
              ...action,
              size: props.size,
              icon: action.icon,
              ...(popConfirm || {}),
              onConfirm: popConfirm?.confirm,
              onCancel: popConfirm?.cancel,
              enable: !!popConfirm,
            };
          });
      });

      return {
        getActions,
        getDropdownList,
        getMoreProps,
      };
    },
  });
</script>
